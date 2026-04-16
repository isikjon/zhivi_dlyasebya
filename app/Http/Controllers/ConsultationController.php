<?php

namespace App\Http\Controllers;

use App\Models\ConsultationSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
            'request' => 'nullable|string',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $slot = ConsultationSlot::query()
                    ->whereDate('slot_date', $validated['date'])
                    ->where('slot_time', $validated['time'].':00')
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if (! $slot) {
                    throw ValidationException::withMessages([
                        'time' => 'Выбранный слот уже занят. Пожалуйста, выберите другое время.',
                    ]);
                }

                DB::table('consultations')->insert([
                    'consultation_slot_id' => $slot->id,
                    'name' => $validated['name'],
                    'contact' => $validated['contact'],
                    'date' => $validated['date'],
                    'time' => $validated['time'],
                    'request' => $validated['request'],
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $slot->update([
                    'is_active' => false,
                    'booked_at' => now(),
                ]);
            });

            $this->sendToTelegram($validated);

            return back()->with('message', 'Заявка успешно отправлена! Мы скоро свяжемся с вами.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Consultation error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Произошла ошибка при отправке. Попробуйте еще раз.']);
        }
    }

    private function sendToTelegram(array $data): void
    {
        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');
        $apiBase = config('services.telegram.api_base', 'https://api.telegram.org');
        $proxy = config('services.telegram.http_proxy');

        if (! $token || ! $chatId) {
            Log::warning('Telegram: задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env');

            return;
        }

        $esc = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $dateFormatted = date('d.m.Y', strtotime($data['date']));
        $lines = [
            '<b>Новая запись на консультацию</b>',
            '',
            '<b>Имя:</b> '.$esc($data['name']),
            '<b>Контакт:</b> '.$esc($data['contact']),
            '<b>Дата:</b> '.$esc($dateFormatted),
            '<b>Время:</b> '.$esc((string) $data['time']),
        ];
        if (! empty($data['request'])) {
            $lines[] = '';
            $lines[] = '<b>Запрос:</b> '.$esc((string) $data['request']);
        }
        $message = implode("\n", $lines);

        $url = "{$apiBase}/bot{$token}/sendMessage";

        $options = [];
        if ($proxy) {
            $options['proxy'] = $proxy;
        }

        try {
            $response = Http::timeout(25)
                ->connectTimeout(12)
                ->withOptions($options)
                ->asForm()
                ->post($url, [
                    'chat_id' => $chatId,
                    'text' => $message,
                    'parse_mode' => 'HTML',
                ]);

            if (! $response->successful()) {
                Log::error('Telegram sendMessage: HTTP ошибка', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return;
            }

            $payload = $response->json();
            if (! ($payload['ok'] ?? false)) {
                Log::error('Telegram sendMessage: ответ API', ['response' => $payload]);
            }
        } catch (\Throwable $e) {
            Log::error('Telegram sendMessage: исключение', [
                'message' => $e->getMessage(),
            ]);
        }
    }
}
