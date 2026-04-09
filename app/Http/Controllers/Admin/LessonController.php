<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string',
            'video' => 'nullable|file|mimes:mp4,mov,avi|max:512000', // 500MB
            'audio' => 'nullable|file|mimes:mp3,wav,ogg|max:102400', // 100MB
            'file' => 'nullable|file|mimes:pdf,doc,docx,zip,jpg,jpeg,png|max:51200', // 50MB
        ]);

        $lessonData = [
            'module_id' => $module->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'video_url' => $validated['video_url'],
            'order' => $module->lessons()->count() + 1,
        ];

        if ($request->hasFile('video')) {
            $lessonData['video_url'] = $request->file('video')->store('lessons/videos', 'public');
        }

        if ($request->hasFile('audio')) {
            $lessonData['audio_path'] = $request->file('audio')->store('lessons/audio', 'public');
        }

        if ($request->hasFile('file')) {
            $lessonData['file_path'] = $request->file('file')->store('lessons/files', 'public');
        }

        Lesson::create($lessonData);

        return back()->with('message', 'Урок успешно добавлен');
    }
}
