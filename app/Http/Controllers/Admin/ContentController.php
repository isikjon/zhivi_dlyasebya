<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Content/Index', [
            'contents' => SiteContent::orderBy('page')->orderBy('section')->get()
        ]);
    }

    public function update(Request $request)
    {
        // Проверяем, это загрузка изображения или обычный контент
        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'required|image|max:2048',
                'page' => 'required|string',
                'section' => 'required|string',
                'key' => 'required|string',
            ]);

            $path = $request->file('image')->store('content', 'public');
            
            SiteContent::updateOrCreate(
                ['page' => $request->page, 'section' => $request->section, 'key' => $request->key],
                ['value' => $path, 'type' => 'image']
            );

            return redirect()->back()->with('message', 'Изображение обновлено');
        }

        $request->validate([
            'id' => 'required|exists:site_contents,id',
            'value' => 'nullable|string'
        ]);

        $content = SiteContent::findOrFail($request->id);
        $content->update(['value' => $request->value]);

        return redirect()->back()->with('message', 'Контент обновлен');
    }

    public function updateByKey(Request $request)
    {
        $request->validate([
            'page' => 'required|string',
            'section' => 'required|string',
            'key' => 'required|string',
            'value' => 'nullable|string'
        ]);

        $content = SiteContent::updateOrCreate(
            ['page' => $request->page, 'section' => $request->section, 'key' => $request->key],
            ['value' => $request->value]
        );

        return redirect()->back()->with('message', 'Контент обновлен');
    }

    /**
     * API для получения контента на фронте
     */
    public static function getContent($page = 'home')
    {
        return SiteContent::where('page', $page)
            ->get()
            ->groupBy('section')
            ->map(function ($section) {
                return $section->pluck('value', 'key');
            });
    }
}
