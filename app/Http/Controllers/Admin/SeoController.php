<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class SeoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Seo/Index', [
            'seoSettings' => SeoSetting::all(),
            'robots' => GlobalSetting::where('key', 'robots_txt')->first()?->value ?? File::get(public_path('robots.txt')),
            'favicon' => GlobalSetting::where('key', 'favicon_path')->first()?->value,
            'scripts' => [
                'head' => GlobalSetting::where('key', 'head_scripts')->first()?->value,
                'body' => GlobalSetting::where('key', 'body_scripts')->first()?->value,
            ]
        ]);
    }

    public function updatePage(Request $request, $page)
    {
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'keywords' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'additional_tags' => 'nullable|string',
        ]);

        if ($request->hasFile('og_image')) {
            $path = $request->file('og_image')->store('seo', 'public');
            $data['og_image'] = $path;
        }

        SeoSetting::updateOrCreate(['page' => $page], $data);

        return back()->with('message', "SEO для страницы $page обновлено");
    }

    public function updateGlobal(Request $request)
    {
        if ($request->has('robots_txt')) {
            GlobalSetting::updateOrCreate(['key' => 'robots_txt'], ['value' => $request->robots_txt]);
            // Write to actual robots.txt file
            File::put(public_path('robots.txt'), $request->robots_txt);
        }

        if ($request->has('head_scripts')) {
            GlobalSetting::updateOrCreate(['key' => 'head_scripts'], ['value' => $request->head_scripts]);
        }

        if ($request->has('body_scripts')) {
            GlobalSetting::updateOrCreate(['key' => 'body_scripts'], ['value' => $request->body_scripts]);
        }

        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('assets', 'public');
            GlobalSetting::updateOrCreate(['key' => 'favicon_path'], ['value' => $path]);
            
            // Also copy to public/favicon.ico for standard browser behavior
            // We might need to convert it if it's not .ico, but let's just use the path in blade for now
        }

        return back()->with('message', 'Глобальные SEO настройки обновлены');
    }

    public function generateSitemap()
    {
        // Simple sitemap generator logic
        $baseUrl = config('app.url');
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;
        
        // Static pages
        $pages = ['', 'catalog', 'login', 'register'];
        foreach ($pages as $page) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . $baseUrl . '/' . $page . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . now()->toAtomString() . '</lastmod>' . PHP_EOL;
            $xml .= '    <changefreq>weekly</changefreq>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        $xml .= '</urlset>';
        
        File::put(public_path('sitemap.xml'), $xml);
        GlobalSetting::updateOrCreate(['key' => 'sitemap_last_generated'], ['value' => now()->toDateTimeString()]);

        return back()->with('message', 'Sitemap.xml успешно сгенерирован');
    }
}
