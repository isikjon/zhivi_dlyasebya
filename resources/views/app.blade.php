<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @if(isset($page['props']['seo']))
            <title inertia>{{ $page['props']['seo']['title'] ?? config('app.name', 'Laravel') }}</title>
            <meta name="description" content="{{ $page['props']['seo']['description'] ?? '' }}">
            <meta name="keywords" content="{{ $page['props']['seo']['keywords'] ?? '' }}">
            
            <!-- Open Graph -->
            <meta property="og:title" content="{{ $page['props']['seo']['og_title'] ?? ($page['props']['seo']['title'] ?? '') }}">
            <meta property="og:description" content="{{ $page['props']['seo']['og_description'] ?? ($page['props']['seo']['description'] ?? '') }}">
            @if(isset($page['props']['seo']['og_image']))
                <meta property="og:image" content="{{ asset('storage/' . $page['props']['seo']['og_image']) }}">
            @endif
            {!! $page['props']['seo']['additional_tags'] ?? '' !!}
        @else
            <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @endif

        @if(isset($page['props']['global_seo']['favicon']))
            <link rel="icon" type="image/x-icon" href="{{ $page['props']['global_seo']['favicon'] }}">
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
