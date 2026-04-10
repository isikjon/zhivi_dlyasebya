<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamController extends Controller
{
    public function stream($path)
    {
        $fullPath = storage_path('app/public/' . $path);

        if (!file_exists($fullPath)) {
            abort(404);
        }

        $size = filesize($fullPath);
        $mime = mime_content_type($fullPath);
        $length = $size;
        $start = 0;
        $end = $size - 1;

        $headers = [
            'Content-Type' => $mime,
            'Accept-Ranges' => 'bytes',
        ];

        $statusCode = 200;

        if (request()->hasHeader('Range')) {
            $range = request()->header('Range');
            if (preg_match('/bytes=(\d*)-(\d*)/', $range, $matches)) {
                $start = $matches[1] !== '' ? intval($matches[1]) : 0;
                $end = $matches[2] !== '' ? intval($matches[2]) : $size - 1;

                if ($start > $end || $start >= $size) {
                    return response('', 416, [
                        'Content-Range' => "bytes */$size",
                    ]);
                }

                $length = $end - $start + 1;
                $statusCode = 206;
                $headers['Content-Range'] = "bytes $start-$end/$size";
            }
        }

        $headers['Content-Length'] = $length;

        return new StreamedResponse(function () use ($fullPath, $start, $length) {
            $stream = fopen($fullPath, 'rb');
            fseek($stream, $start);
            $remaining = $length;
            $bufferSize = 8192;

            while ($remaining > 0 && !feof($stream)) {
                $read = min($bufferSize, $remaining);
                echo fread($stream, $read);
                $remaining -= $read;
                flush();
            }

            fclose($stream);
        }, $statusCode, $headers);
    }
}
