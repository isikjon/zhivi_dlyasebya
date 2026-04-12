<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @if(isset($page['props']['seo']))
            <title inertia>{{ $page['props']['seo']['title'] ?? config('app.name', 'Laravel') }}</title>
            <meta inertia name="description" content="{{ $page['props']['seo']['description'] ?? '' }}">
            <meta inertia name="keywords" content="{{ $page['props']['seo']['keywords'] ?? '' }}">
            <meta inertia property="og:title" content="{{ $page['props']['seo']['og_title'] ?? ($page['props']['seo']['title'] ?? '') }}">
            <meta inertia property="og:description" content="{{ $page['props']['seo']['og_description'] ?? ($page['props']['seo']['description'] ?? '') }}">
            @if(isset($page['props']['seo']['og_image']))
                <meta inertia property="og:image" content="{{ asset('storage/' . $page['props']['seo']['og_image']) }}">
            @endif
            {!! $page['props']['seo']['additional_tags'] ?? '' !!}
        @else
            <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @endif

        @if(isset($page['props']['global_seo']['favicon']))
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
            <link rel="manifest" href="/site.webmanifest">
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0A2E2E">
            <meta name="msapplication-TileColor" content="#0A2E2E">
            <meta name="theme-color" content="#0A2E2E">
        @endif

        {!! $page['props']['global_seo']['head_scripts'] ?? '' !!}

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <style>
            body {
                background-color: #0A2E2E !important;
                margin: 0;
                padding: 0;
            }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="antialiased bg-quantum-emerald">
        {!! $page['props']['global_seo']['body_scripts'] ?? '' !!}
        <div class="bg-waves"></div>
        <div class="particles"></div>
        @inertia
    </body>
</html>
