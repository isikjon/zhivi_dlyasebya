<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
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
        if ($path === '') {
            $path = 'home';
        }

        $knownPages = ['home', 'catalog', 'login', 'register', 'live-yourself', 'archetypes'];
        $seoPage = in_array($path, $knownPages, true) ? $path : null;

        $seo = null;
        $globalSeo = [
            'favicon' => null,
            'head_scripts' => null,
            'body_scripts' => null,
        ];
        $siteContent = [];
        $mainCourse = null;
        $consultationAvailability = [];

        try {
            if (Schema::hasTable('seo_settings') && Schema::hasTable('global_settings')) {
                $seo = $seoPage ? \App\Models\SeoSetting::where('page', $seoPage)->first() : null;
                $favicon = \App\Models\GlobalSetting::where('key', 'favicon_path')->first()?->value;
                $headScripts = \App\Models\GlobalSetting::where('key', 'head_scripts')->first()?->value;
                $bodyScripts = \App\Models\GlobalSetting::where('key', 'body_scripts')->first()?->value;

                $globalSeo = [
                    'favicon' => $favicon ? "/storage/$favicon" : null,
                    'head_scripts' => $headScripts,
                    'body_scripts' => $bodyScripts,
                ];
            }

            if (Schema::hasTable('site_contents')) {
                $siteContent = \App\Http\Controllers\Admin\ContentController::getContent('home');
            }

            if (Schema::hasTable('courses')) {
                $mainCourse = \App\Models\Course::where('is_main', true)->first();
            }

            if (Schema::hasTable('consultation_slots')) {
                $today = Carbon::today();
                $dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                $monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

                $slotsByDate = \App\Models\ConsultationSlot::query()
                    ->where('is_active', true)
                    ->whereBetween('slot_date', [$today->toDateString(), $today->copy()->addDays(6)->toDateString()])
                    ->orderBy('slot_date')
                    ->orderBy('slot_time')
                    ->get()
                    ->groupBy(fn (\App\Models\ConsultationSlot $slot) => $slot->slot_date->toDateString())
                    ->map(fn ($items) => $items->pluck('slot_time')->map(function (string $time) {
                        return substr($time, 0, 5);
                    })->values())
                    ->toArray();

                for ($i = 0; $i < 7; $i++) {
                    $date = $today->copy()->addDays($i);
                    $isoDate = $date->toDateString();

                    $consultationAvailability[] = [
                        'isoDate' => $isoDate,
                        'dayName' => $dayNames[$date->dayOfWeek],
                        'dayNum' => $date->day,
                        'month' => $monthNames[$date->month - 1],
                        'times' => $slotsByDate[$isoDate] ?? [],
                    ];
                }
            }
        } catch (\Throwable) {
            // Graceful fallback when DB or migrations are not ready yet.
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'is_admin' => $request->user() ? $request->user()->email === 'admin@admin.com' : false,
            ],
            'seo' => $seo,
            'global_seo' => $globalSeo,
            'siteContent' => $siteContent,
            'mainCourse' => $mainCourse,
            'consultationAvailability' => $consultationAvailability,
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
