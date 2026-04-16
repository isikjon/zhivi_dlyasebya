<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultation_slots', function (Blueprint $table) {
            $table->id();
            $table->date('slot_date');
            $table->time('slot_time');
            $table->boolean('is_active')->default(true);
            $table->timestamp('booked_at')->nullable();
            $table->timestamps();

            $table->unique(['slot_date', 'slot_time']);
            $table->index(['slot_date', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultation_slots');
    }
};

