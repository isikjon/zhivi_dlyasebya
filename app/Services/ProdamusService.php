<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Course;
use App\Models\User;
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

    public function createPaymentLink(User $user, Course $course, Payment $payment): string
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

        $query = http_build_query($params);
        return "{$this->baseUrl}/?{$query}";
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
