<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\LessonAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    public function store(Request $request, Module $module)
    {
        // Увеличиваем лимиты PHP на лету для текущего запроса
        @ini_set('upload_max_filesize', '500M');
        @ini_set('post_max_size', '500M');
        @ini_set('memory_limit', '512M');

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'video_url' => 'nullable|string',
                'video' => 'nullable|file|max:512000', // 500MB
                'audios.*' => 'nullable|file|max:102400', // 100MB per audio
                'files.*' => 'nullable|file|max:102400', // 100MB per file
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

            $lesson = Lesson::create($lessonData);

            // Сохраняем несколько аудио
            if ($request->hasFile('audios')) {
                foreach ($request->file('audios') as $audioFile) {
                    LessonAsset::create([
                        'lesson_id' => $lesson->id,
                        'type' => 'audio',
                        'path' => $audioFile->store('lessons/audio', 'public'),
                        'name' => $audioFile->getClientOriginalName(),
                    ]);
                }
            }

            // Сохраняем несколько файлов
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    LessonAsset::create([
                        'lesson_id' => $lesson->id,
                        'type' => 'file',
                        'path' => $file->store('lessons/files', 'public'),
                        'name' => $file->getClientOriginalName(),
                    ]);
                }
            }

            return back()->with('message', 'Урок успешно добавлен');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Upload error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Ошибка при загрузке: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Lesson $lesson)
    {
        @ini_set('upload_max_filesize', '500M');
        @ini_set('post_max_size', '500M');
        @ini_set('memory_limit', '512M');

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'video_url' => 'nullable|string',
                'video' => 'nullable|file|max:512000',
                'audios.*' => 'nullable|file|max:102400',
                'files.*' => 'nullable|file|max:102400',
            ]);

            $lessonData = [
                'title' => $validated['title'],
                'content' => $validated['content'],
                'video_url' => $validated['video_url'],
            ];

            if ($request->hasFile('video')) {
                if ($lesson->video_url && !str_starts_with($lesson->video_url, 'http')) {
                    Storage::disk('public')->delete($lesson->video_url);
                }
                $lessonData['video_url'] = $request->file('video')->store('lessons/videos', 'public');
            }

            $lesson->update($lessonData);

            if ($request->hasFile('audios')) {
                foreach ($request->file('audios') as $audioFile) {
                    LessonAsset::create([
                        'lesson_id' => $lesson->id,
                        'type' => 'audio',
                        'path' => $audioFile->store('lessons/audio', 'public'),
                        'name' => $audioFile->getClientOriginalName(),
                    ]);
                }
            }

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    LessonAsset::create([
                        'lesson_id' => $lesson->id,
                        'type' => 'file',
                        'path' => $file->store('lessons/files', 'public'),
                        'name' => $file->getClientOriginalName(),
                    ]);
                }
            }

            return back()->with('message', 'Урок обновлен');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Update error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Ошибка при обновлении: ' . $e->getMessage()]);
        }
    }

    public function destroy(Lesson $lesson)
    {
        // Удаляем основное видео
        if ($lesson->video_url && !str_starts_with($lesson->video_url, 'http')) {
            Storage::disk('public')->delete($lesson->video_url);
        }

        // Удаляем все прикрепленные ассеты (аудио и файлы)
        foreach ($lesson->assets as $asset) {
            Storage::disk('public')->delete($asset->path);
            $asset->delete();
        }

        $lesson->delete();
        return back()->with('message', 'Урок удален');
    }

    public function removeAsset(\App\Models\LessonAsset $asset)
    {
        Storage::disk('public')->delete($asset->path);
        $asset->delete();
        return back()->with('message', 'Файл удален');
    }
}
