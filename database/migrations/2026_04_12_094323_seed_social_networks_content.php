<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $contacts = [
            ['page' => 'home', 'section' => 'SocialNetworks', 'key' => 'phone', 'value' => '+7 (999) 000-00-00', 'type' => 'text'],
            ['page' => 'home', 'section' => 'SocialNetworks', 'key' => 'email', 'value' => 'hello@zhivisebya.ru', 'type' => 'text'],
            ['page' => 'home', 'section' => 'SocialNetworks', 'key' => 'telegram', 'value' => '@victoria_neustroeva', 'type' => 'text'],
            ['page' => 'home', 'section' => 'SocialNetworks', 'key' => 'telegram_link', 'value' => 'https://t.me/victoria_neustroeva', 'type' => 'text'],
        ];

        foreach ($contacts as $contact) {
            DB::table('site_contents')->updateOrInsert(
                ['page' => $contact['page'], 'section' => $contact['section'], 'key' => $contact['key']],
                ['value' => $contact['value'], 'type' => $contact['type'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('site_contents')->where('section', 'SocialNetworks')->delete();
    }
};
