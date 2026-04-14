<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $path = trim($request->path(), '/');
        if ($path === '') $path = 'home';
        
        // Check if it's a known static page
        $knownPages = ['home', 'catalog', 'login', 'register', 'live-yourself', 'archetypes'];
        $seoPage = in_array($path, $knownPages) ? $path : null;

        $seo = $seoPage ? \App\Models\SeoSetting::where('page', $seoPage)->first() : null;
        $favicon = \App\Models\GlobalSetting::where('key', 'favicon_path')->first()?->value;
        $headScripts = \App\Models\GlobalSetting::where('key', 'head_scripts')->first()?->value;
        $bodyScripts = \App\Models\GlobalSetting::where('key', 'body_scripts')->first()?->value;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'is_admin' => $request->user() ? $request->user()->email === 'admin@admin.com' : false,
            ],
            'seo' => $seo,
            'global_seo' => [
                'favicon' => $favicon ? "/storage/$favicon" : null,
                'head_scripts' => $headScripts,
                'body_scripts' => $bodyScripts,
            ],
            'siteContent' => \App\Http\Controllers\Admin\ContentController::getContent('home'),
            'mainCourse' => \App\Models\Course::where('is_main', true)->first(),
            'flash' => [
                'message' => $request->session()->get('message'),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
