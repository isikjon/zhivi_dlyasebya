<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('general');
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('text');
            $table->timestamps();
        });

        DB::table('settings')->insert([
            ['group' => 'prodamus', 'key' => 'prodamus_url', 'value' => '', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['group' => 'prodamus', 'key' => 'prodamus_secret_key', 'value' => '', 'type' => 'password', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
