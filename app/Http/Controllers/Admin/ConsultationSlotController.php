<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsultationSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ConsultationSlotController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $days = [];
        $dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        $monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

        for ($i = 0; $i < 7; $i++) {
            $date = $today->copy()->addDays($i);
            $days[] = [
                'date' => $date->toDateString(),
                'day_name' => $dayNames[$date->dayOfWeek],
                'day_num' => $date->day,
                'month' => $monthNames[$date->month - 1],
            ];
        }

        $slots = ConsultationSlot::query()
            ->forNextWeek()
            ->where('is_active', true)
            ->get()
            ->groupBy(fn (ConsultationSlot $slot) => $slot->slot_date->toDateString())
            ->map(fn ($items) => $items->pluck('slot_time')->map(function (string $time) {
                return substr($time, 0, 5);
            })->values())
            ->toArray();

        return Inertia::render('Admin/ConsultationSlots/Index', [
            'days' => $days,
            'slots' => $slots,
        ]);
    }

    public function store(Request $request)
    {
        $today = Carbon::today();
        $weekEnd = $today->copy()->addDays(6);

        $validated = $request->validate([
            'slot_date' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:'.$today->toDateString(),
                'before_or_equal:'.$weekEnd->toDateString(),
            ],
            'slot_time' => ['required', 'date_format:H:i'],
        ]);

        ConsultationSlot::updateOrCreate(
            [
                'slot_date' => $validated['slot_date'],
                'slot_time' => $validated['slot_time'].':00',
            ],
            [
                'is_active' => true,
                'booked_at' => null,
            ]
        );

        return back()->with('message', 'Слот добавлен');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'slot_date' => ['required', 'date_format:Y-m-d'],
            'slot_time' => ['required', 'date_format:H:i'],
        ]);

        ConsultationSlot::query()
            ->whereDate('slot_date', $validated['slot_date'])
            ->where('slot_time', $validated['slot_time'].':00')
            ->delete();

        return back()->with('message', 'Слот удален');
    }
}
