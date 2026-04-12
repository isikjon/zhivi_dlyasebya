<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|string',
            'request' => 'nullable|string',
        ]);

        try {
            // Save to database
            DB::table('consultations')->insert([
                'name' => $validated['name'],
                'contact' => $validated['contact'],
                'date' => $validated['date'],
                'time' => $validated['time'],
                'request' => $validated['request'],
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Send to Telegram
            $this->sendToTelegram($validated);

            return back()->with('message', 'Заявка успешно отправлена! Мы скоро свяжемся с вами.');
        } catch (\Exception $e) {
            Log::error('Consultation error: ' . $e->getMessage());
            return response()->json(['message' => 'Произошла ошибка при отправке.'], 500);
        }
    }

    private function sendToTelegram($data)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$token || !$chatId) {
            Log::warning('Telegram credentials not set');
            return;
        }

        $dateFormatted = date('d.m.Y', strtotime($data['date']));
        
        $message = "🔔 *Новая запись на консультацию*\n\n";
        $message .= "👤 *Имя:* {$data['name']}\n";
        $message .= "📞 *Контакт:* {$data['contact']}\n";
        $message .= "📅 *Дата:* {$dateFormatted}\n";
        $message .= "⏰ *Время:* {$data['time']}\n";
        
        if (!empty($data['request'])) {
            $message .= "\n📝 *Запрос:* {$data['request']}";
        }

        try {
            Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
            ]);
        } catch (\Exception $e) {
            Log::error('Telegram send error: ' . $e->getMessage());
        }
    }
}
