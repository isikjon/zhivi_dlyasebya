<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page')->default('home');
            $table->string('section');
            $table->string('key');
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, html, image
            $table->timestamps();
            
            $table->unique(['page', 'section', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
    }
};
