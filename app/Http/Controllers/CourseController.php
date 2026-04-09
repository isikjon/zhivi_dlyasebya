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

        return Inertia::render('Cabinet/Dashboard', [
            'myCourses' => Course::whereIn('id', $enrolledCourseIds)->get(),
            'availableCourses' => Course::whereNotIn('id', $enrolledCourseIds)->where('is_active', true)->get()
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

        return Inertia::render('Cabinet/Course/Show', [
            'course' => $course->load(['modules' => function($q) {
                $q->orderBy('order');
            }, 'modules.lessons' => function($q) {
                $q->orderBy('order');
            }])
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

        return Inertia::render('Cabinet/Lesson/Show', [
            'lesson' => $lesson->load('module.course'),
            'course' => $course->load(['modules.lessons' => function($q) {
                $q->orderBy('order');
            }])
        ]);
    }
}
