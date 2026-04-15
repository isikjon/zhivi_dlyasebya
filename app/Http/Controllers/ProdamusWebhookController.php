<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Payment;
use App\Services\ProdamusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProdamusWebhookController extends Controller
{
    public function __construct(
        private ProdamusService $prodamus
    ) {}

    public function handle(Request $request)
    {
        $data = $request->all();

        Log::info('Prodamus webhook received', ['data' => $data]);

        $signature = $request->header('Sign', '');

        if (!$this->prodamus->verifySignature($data, $signature)) {
            Log::warning('Prodamus webhook: invalid signature', [
                'received_sign' => $signature,
                'data' => $data,
            ]);
            return response('Invalid signature', 400);
        }

        $orderId = $data['order_num'] ?? $data['order_id'] ?? null;

        if (!$orderId) {
            Log::warning('Prodamus webhook: no order_num', ['data' => $data]);
            return response('No order_num', 400);
        }

        $payment = Payment::where('order_id', $orderId)->first();

        if (!$payment) {
            Log::warning('Prodamus webhook: payment not found', ['order_num' => $orderId]);
            return response('Payment not found', 404);
        }

        $paymentStatus = strtolower($data['payment_status'] ?? '');

        if ($paymentStatus === 'success') {
            $payment->update([
                'status' => 'success',
                'payment_id' => $data['order_id'] ?? null,
                'payment_method' => $data['payment_type'] ?? null,
                'prodamus_data' => $data,
                'paid_at' => now(),
            ]);

            $this->activateEnrollment($payment);

            Log::info('Prodamus webhook: payment success', [
                'order_num' => $orderId,
                'sum' => $data['sum'] ?? null,
            ]);
        } elseif (in_array($paymentStatus, ['fail', 'rejected', 'error'])) {
            $payment->update([
                'status' => 'fail',
                'prodamus_data' => $data,
            ]);

            Log::info('Prodamus webhook: payment failed', [
                'order_num' => $orderId,
                'status' => $paymentStatus,
            ]);
        } elseif (in_array($paymentStatus, ['refund', 'order_canceled'])) {
            $payment->update([
                'status' => 'refund',
                'prodamus_data' => $data,
            ]);

            $this->deactivateEnrollment($payment);

            Log::info('Prodamus webhook: payment refunded/canceled', [
                'order_num' => $orderId,
            ]);
        }

        return response('OK', 200);
    }

    private function activateEnrollment(Payment $payment): void
    {
        Enrollment::updateOrCreate(
            [
                'user_id' => $payment->user_id,
                'course_id' => $payment->course_id,
            ],
            [
                'is_active' => true,
                'enrolled_at' => now(),
            ]
        );
    }

    private function deactivateEnrollment(Payment $payment): void
    {
        Enrollment::where('user_id', $payment->user_id)
            ->where('course_id', $payment->course_id)
            ->update(['is_active' => false]);
    }
}
