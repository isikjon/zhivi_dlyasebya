<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Courses/Index', [
            'courses' => Course::withCount('modules')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Courses/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_main' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->has('is_main') && $request->is_main) {
            Course::where('is_main', true)->update(['is_main' => false]);
        }

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('courses', 'public');
        }

        Course::create($validated);

        return redirect()->route('admin.courses.index')->with('message', 'Курс успешно создан');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'is_main' => 'boolean',
        ]);

        if ($request->has('is_main') && $request->is_main) {
            Course::where('id', '!=', $course->id)->where('is_main', true)->update(['is_main' => false]);
        }

        if ($request->hasFile('image')) {
            // Можно добавить удаление старой картинки
            $validated['image_path'] = $request->file('image')->store('courses', 'public');
        }

        $course->update($validated);

        return redirect()->route('admin.courses.index')->with('message', 'Курс обновлен');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return redirect()->route('admin.courses.index')->with('message', 'Курс удален');
    }

    public function show(Course $course)
    {
        return Inertia::render('Admin/Courses/Show', [
            'course' => $course->load('modules.lessons.assets')
        ]);
    }
}
