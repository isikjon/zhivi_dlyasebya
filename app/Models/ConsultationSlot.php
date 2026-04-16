<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class ConsultationSlot extends Model
{
    protected $fillable = [
        'slot_date',
        'slot_time',
        'is_active',
        'booked_at',
    ];

    protected $casts = [
        'slot_date' => 'date',
        'is_active' => 'boolean',
        'booked_at' => 'datetime',
    ];

    public function scopeForNextWeek(Builder $query): Builder
    {
        $today = Carbon::today();
        $weekEnd = $today->copy()->addDays(6);

        return $query
            ->whereBetween('slot_date', [$today->toDateString(), $weekEnd->toDateString()])
            ->orderBy('slot_date')
            ->orderBy('slot_time');
    }
}

