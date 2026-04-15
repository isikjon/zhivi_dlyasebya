<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('order_id')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('rub');
            $table->string('status')->default('pending'); // pending, success, fail, refund
            $table->string('payment_id')->nullable();
            $table->string('payment_method')->nullable();
            $table->json('prodamus_data')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
