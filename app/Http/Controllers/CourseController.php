<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $enrolledCourseIds = Enrollment::where('user_id', $user->id)
            ->where('is_active', true)
            ->pluck('course_id');

        $myCourses = Course::whereIn('id', $enrolledCourseIds)
            ->with('modules.lessons')
            ->get()
            ->map(function($course) use ($user) {
                $lessonIds = $course->modules->flatMap(fn($m) => $m->lessons->pluck('id'));
                $totalLessons = $lessonIds->count();
                $completedLessons = \App\Models\LessonProgress::where('user_id', $user->id)
                    ->whereIn('lesson_id', $lessonIds)
                    ->where('is_completed', true)
                    ->count();

                $course->total_lessons = $totalLessons;
                $course->completed_lessons = $completedLessons;
                $course->progress_percent = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;

                return $course;
            });

        $availableCourses = Course::whereNotIn('id', $enrolledCourseIds)
            ->where('is_active', true)
            ->with('modules.lessons')
            ->get()
            ->map(function($course) {
                $course->total_lessons = $course->modules->flatMap(fn($m) => $m->lessons)->count();
                return $course;
            });

        return Inertia::render('Cabinet/Dashboard', [
            'myCourses' => $myCourses,
            'availableCourses' => $availableCourses,
        ]);
    }

    public function show(Course $course)
    {
        // Проверка доступа
        $isEnrolled = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->where('is_active', true)
            ->exists();

        if (!$isEnrolled) {
            return redirect()->route('cabinet.index')->with('error', 'У вас нет доступа к этому курсу');
        }

        $completedLessonIds = \App\Models\LessonProgress::where('user_id', Auth::id())
            ->where('is_completed', true)
            ->pluck('lesson_id')
            ->toArray();

        return Inertia::render('Cabinet/Course/Show', [
            'course' => $course->load(['modules' => function($q) {
                $q->orderBy('order');
            }, 'modules.lessons' => function($q) {
                $q->orderBy('order');
            }, 'modules.lessons.assets']),
            'completedLessonIds' => $completedLessonIds
        ]);
    }

    public function showLesson(\App\Models\Lesson $lesson)
    {
        $course = $lesson->module->course;
        
        // Проверка доступа
        $isEnrolled = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->where('is_active', true)
            ->exists();

        if (!$isEnrolled && !$lesson->is_free) {
            return redirect()->route('cabinet.index')->with('error', 'У вас нет доступа к этому уроку');
        }

        $progress = \App\Models\LessonProgress::where('user_id', Auth::id())
            ->where('lesson_id', $lesson->id)
            ->first();

        $completedLessonIds = \App\Models\LessonProgress::where('user_id', Auth::id())
            ->where('is_completed', true)
            ->pluck('lesson_id')
            ->toArray();

        return Inertia::render('Cabinet/Lesson/Show', [
            'lesson' => $lesson->load(['module.course', 'assets']),
            'course' => $course->load(['modules' => function($q) {
                $q->orderBy('order');
            }, 'modules.lessons' => function($q) {
                $q->orderBy('order');
            }]),
            'is_completed' => $progress ? $progress->is_completed : false,
            'completedLessonIds' => $completedLessonIds
        ]);
    }

    public function enroll(Course $course)
    {
        $user = Auth::user();

        // Если курс уже куплен/активирован
        if (Enrollment::where('user_id', $user->id)->where('course_id', $course->id)->exists()) {
            return redirect()->route('cabinet.course.show', $course->id);
        }

        // Если курс бесплатный, активируем сразу
        if ($course->price == 0) {
            Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'is_active' => true,
                'enrolled_at' => now(),
            ]);

            return redirect()->route('cabinet.course.show', $course->id)->with('message', 'Курс успешно добавлен в ваш кабинет');
        }

        // Для платных курсов пока просто редирект на оплату (заглушка)
        return back()->with('error', 'Оплата временно недоступна. Пожалуйста, свяжитесь с администратором.');
    }

    public function completeLesson(\App\Models\Lesson $lesson)
    {
        \App\Models\LessonProgress::updateOrCreate(
            ['user_id' => Auth::id(), 'lesson_id' => $lesson->id],
            ['is_completed' => true, 'completed_at' => now()]
        );

        return back()->with('message', 'Урок отмечен как пройденный');
    }
}
