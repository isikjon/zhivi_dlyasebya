<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class SeoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Seo/Index', [
            'seoSettings' => SeoSetting::all(),
            'robots' => GlobalSetting::where('key', 'robots_txt')->first()?->value ?? (File::exists(public_path('robots.txt')) ? File::get(public_path('robots.txt')) : ''),
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
            $image = $request->file('favicon');
            
            // Create image manager with desired driver
            $manager = new ImageManager(new Driver());
            
            // Generate various sizes
            $sizes = [
                ['name' => 'favicon-16x16.png', 'size' => 16],
                ['name' => 'favicon-32x32.png', 'size' => 32],
                ['name' => 'apple-touch-icon.png', 'size' => 180],
                ['name' => 'android-chrome-192x192.png', 'size' => 192],
                ['name' => 'android-chrome-512x512.png', 'size' => 512],
            ];

            foreach ($sizes as $s) {
                $img = $manager->decode($image->getRealPath());
                $img->cover($s['size'], $s['size']);
                $img->save(public_path($s['name']));
            }

            // Also save as favicon.ico (standard fallback)
            $img = $manager->decode($image->getRealPath());
            $img->cover(48, 48);
            // Save as PNG then rename to .ico to bypass GD's lack of ICO support
            $icoPath = public_path('favicon.ico');
            $img->save(public_path('favicon-48x48.png'));
            if (File::exists($icoPath)) File::delete($icoPath);
            File::move(public_path('favicon-48x48.png'), $icoPath);

            // Generate site.webmanifest
            $manifest = [
                'name' => config('app.name'),
                'short_name' => config('app.name'),
                'icons' => [
                    [
                        'src' => '/android-chrome-192x192.png',
                        'sizes' => '192x192',
                        'type' => 'image/png'
                    ],
                    [
                        'src' => '/android-chrome-512x512.png',
                        'sizes' => '512x512',
                        'type' => 'image/png'
                    ]
                ],
                'theme_color' => '#0A2E2E',
                'background_color' => '#0A2E2E',
                'display' => 'standalone'
            ];
            File::put(public_path('site.webmanifest'), json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            // Store the path of the largest one or just mark as updated
            GlobalSetting::updateOrCreate(['key' => 'favicon_path'], ['value' => 'android-chrome-512x512.png']);
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
