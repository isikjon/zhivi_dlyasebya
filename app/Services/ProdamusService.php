<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProdamusService
{
    private string $baseUrl;
    private string $secretKey;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.prodamus.url', ''), '/');
        $this->secretKey = config('services.prodamus.secret_key', '');
    }

    public function isConfigured(): bool
    {
        return !empty($this->baseUrl) && !empty($this->secretKey);
    }

    /**
     * URL запроса к Payform с do=link (в ответ приходит текстовая ссылка на страницу оплаты).
     */
    public function createPaymentLink(User $user, Course $course, Payment $payment): string
    {
        $query = http_build_query($this->linkRequestParams($user, $course, $payment));

        return "{$this->baseUrl}/?{$query}";
    }

    /**
     * Итоговый URL страницы оплаты: сервер запрашивает do=link и перенаправляет пользователя на тело ответа,
     * чтобы не показывать промежуточный экран с «голой» ссылкой.
     */
    public function resolveCheckoutUrl(User $user, Course $course, Payment $payment): string
    {
        $linkApiUrl = $this->createPaymentLink($user, $course, $payment);

        try {
            $response = Http::timeout(25)
                ->connectTimeout(12)
                ->withOptions([
                    'allow_redirects' => false,
                    'curl' => [
                        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                    ],
                ])
                ->get($linkApiUrl);

            $status = $response->status();
            if ($status >= 300 && $status < 400) {
                $location = $response->header('Location');
                if ($location && $this->isAllowedCheckoutUrl($location)) {
                    return $location;
                }
            }

            if ($response->successful()) {
                $body = trim($response->body());
                $firstLine = trim(preg_split('/\R/', $body, 2)[0] ?? '');
                $candidate = $firstLine;

                if (preg_match('#https?://[^\s<>"\'`]+#i', $firstLine, $m)) {
                    $candidate = rtrim($m[0], ".,;)\]}\"'");
                }

                if ($candidate !== '' && $this->isAllowedCheckoutUrl($candidate)) {
                    return $candidate;
                }
            }

            Log::warning('Prodamus do=link: не удалось извлечь URL оплаты', [
                'status' => $status,
                'body_preview' => mb_substr($response->body(), 0, 200),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Prodamus do=link: ошибка запроса', ['message' => $e->getMessage()]);
        }

        return $linkApiUrl;
    }

    private function linkRequestParams(User $user, Course $course, Payment $payment): array
    {
        $params = [
            'order_num' => $payment->order_id,
            'customer_email' => $user->email,
            'customer_phone' => $user->phone ?? '',
            'customer_extra' => $user->name,
            'products' => [
                [
                    'name' => $course->title,
                    'price' => number_format($course->price, 2, '.', ''),
                    'quantity' => '1',
                ],
            ],
            'do' => 'link',
            'urlReturn' => route('payment.return', $payment->order_id),
            'urlSuccess' => route('payment.success', $payment->order_id),
            'urlNotification' => route('prodamus.webhook'),
            'sys' => 'zhivisebya',
            'paid_content' => "Доступ к курсу: {$course->title}",
        ];
        $params['signature'] = $this->generateSignature($params);

        return $params;
    }

    private function isAllowedCheckoutUrl(string $url): bool
    {
        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        $host = parse_url($url, PHP_URL_HOST);
        if (! is_string($host) || $host === '') {
            return false;
        }

        $host = strtolower($host);

        return $host === 'payform.ru'
            || str_ends_with($host, '.payform.ru')
            || str_ends_with($host, '.prodamus.link');
    }

    public function generateSignature(array $data): string
    {
        $data = $this->normalizeData($data);
        ksort($data);
        $str = json_encode($data, JSON_UNESCAPED_UNICODE);
        return hash_hmac('sha256', $str, $this->secretKey);
    }

    public function verifySignature(array $data, string $signature): bool
    {
        $checkData = $data;
        unset($checkData['signature']);
        $checkData = $this->normalizeData($checkData);
        ksort($checkData);
        $str = json_encode($checkData, JSON_UNESCAPED_UNICODE);
        $expected = hash_hmac('sha256', $str, $this->secretKey);

        return hash_equals($expected, $signature);
    }

    public function createOrder(User $user, Course $course): Payment
    {
        return Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'order_id' => 'ORD-' . strtoupper(Str::random(12)),
            'amount' => $course->price,
            'currency' => 'rub',
            'status' => 'pending',
        ]);
    }

    private function normalizeData(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $result[$key] = $this->normalizeData($value);
            } else {
                $result[$key] = (string) $value;
            }
        }
        return $result;
    }
}
