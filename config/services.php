<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'prodamus' => [
        'url' => env('PRODAMUS_URL', 'https://yourshop.prodamus.link'),
        'secret_key' => env('PRODAMUS_SECRET_KEY', ''),
    ],

    'telegram' => [
        'bot_token' => env('TELEGRAM_BOT_TOKEN'),
        'chat_id' => env('TELEGRAM_CHAT_ID'),
        /** Официальный API; при блокировке хостингом можно указать свой HTTPS-прокси (например Cloudflare Worker), без завершающего слэша */
        'api_base' => rtrim((string) (env('TELEGRAM_API_BASE') ?: 'https://api.telegram.org'), '/'),
        /** Опционально: http://user:pass@host:port или socks5://host:port для Guzzle */
        'http_proxy' => env('TELEGRAM_HTTP_PROXY'),
    ],

];
