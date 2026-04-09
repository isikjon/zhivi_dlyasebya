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
        ]);

        Course::create($validated);

        return redirect()->route('admin.courses.index');
    }

    public function show(Course $course)
    {
        return Inertia::render('Admin/Courses/Show', [
            'course' => $course->load('modules.lessons')
        ]);
    }
}
