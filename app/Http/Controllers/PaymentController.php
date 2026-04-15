<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Services\ProdamusService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        private ProdamusService $prodamus
    ) {}

    public function initiate(Course $course)
    {
        $user = Auth::user();

        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('is_active', true)
            ->first();

        if ($existingEnrollment) {
            return redirect()->route('cabinet.course.show', $course->id)
                ->with('message', 'Вы уже записаны на этот курс');
        }

        if ($course->price == 0) {
            Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'is_active' => true,
                'enrolled_at' => now(),
            ]);
            return redirect()->route('cabinet.course.show', $course->id)
                ->with('message', 'Курс успешно добавлен');
        }

        if (!$this->prodamus->isConfigured()) {
            return back()->with('error', 'Платёжная система не настроена. Обратитесь к администратору.');
        }

        $pendingPayment = Payment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subHours(2))
            ->first();

        if ($pendingPayment) {
            $paymentUrl = $this->prodamus->createPaymentLink($user, $course, $pendingPayment);
            return Inertia::location($paymentUrl);
        }

        $payment = $this->prodamus->createOrder($user, $course);
        $paymentUrl = $this->prodamus->createPaymentLink($user, $course, $payment);

        return Inertia::location($paymentUrl);
    }

    public function success(string $orderId)
    {
        $payment = Payment::where('order_id', $orderId)->firstOrFail();

        return Inertia::render('Payment/Success', [
            'payment' => $payment->load('course'),
            'courseId' => $payment->course_id,
        ]);
    }

    public function returnPage(string $orderId)
    {
        $payment = Payment::where('order_id', $orderId)->firstOrFail();

        if ($payment->status === 'success') {
            return redirect()->route('payment.success', $orderId);
        }

        return Inertia::render('Payment/Pending', [
            'payment' => $payment->load('course'),
        ]);
    }

    public function history()
    {
        $payments = Payment::where('user_id', Auth::id())
            ->with('course')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Payment/History', [
            'payments' => $payments,
        ]);
    }
}
