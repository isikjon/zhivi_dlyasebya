<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['user', 'course'])
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $payments->where('status', 'success')->sum('amount'),
            'count' => $payments->where('status', 'success')->count(),
            'pending' => $payments->where('status', 'pending')->count(),
            'refunds' => $payments->where('status', 'refund')->count(),
        ];

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'stats' => $stats,
        ]);
    }
}
