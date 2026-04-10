<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $course->modules()->create([
            'title' => $validated['title'],
            'order' => $course->modules()->count() + 1,
        ]);

        return back()->with('message', 'Модуль успешно добавлен');
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $module->update($validated);

        return back()->with('message', 'Модуль обновлен');
    }

    public function destroy(Module $module)
    {
        $module->delete();
        return back()->with('message', 'Модуль удален');
    }
}
