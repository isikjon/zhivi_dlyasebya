<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Symfony\Component\HttpFoundation\Response;

class CustomValidatePostSize
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Исключаем маршрут загрузки уроков из проверки размера POST на уровне Laravel
        if ($request->is('admin/modules/*/lessons')) {
            return $next($request);
        }

        $max = $this->getPostMaxSize();

        if ($max > 0 && $request->server('CONTENT_LENGTH') > $max) {
            throw new PostTooLargeException;
        }

        return $next($request);
    }

    /**
     * Determine the server's post_max_size.
     *
     * @return int
     */
    protected function getPostMaxSize()
    {
        $postMaxSize = ini_get('post_max_size');

        if (is_numeric($postMaxSize)) {
            return (int) $postMaxSize;
        }

        $metric = strtoupper(substr($postMaxSize, -1));
        $value = (int) substr($postMaxSize, 0, -1);

        switch ($metric) {
            case 'K':
                return $value * 1024;
            case 'M':
                return $value * 1048576;
            case 'G':
                return $value * 1073741824;
            default:
                return $value;
        }
    }
}
