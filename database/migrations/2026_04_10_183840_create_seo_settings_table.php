<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('page')->unique(); // 'home', 'catalog', 'login', etc.
            $blueprint->string('title')->nullable();
            $blueprint->text('description')->nullable();
            $blueprint->string('keywords')->nullable();
            $blueprint->string('og_title')->nullable();
            $blueprint->text('og_description')->nullable();
            $blueprint->string('og_image')->nullable();
            $blueprint->text('additional_tags')->nullable(); // For custom scripts/meta
            $blueprint->timestamps();
        });

        // Global settings table or just use site_contents? 
        // Let's add a global section to site_contents or a new table for robots/sitemap/favicon
        Schema::create('global_settings', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('key')->unique();
            $blueprint->text('value')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
        Schema::dropIfExists('global_settings');
    }
};
