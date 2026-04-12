<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SeoFaviconTest extends TestCase
{
    use RefreshDatabase;

    public function test_favicon_generation_works()
    {
        Storage::fake('public');
        
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $this->actingAs($admin);

        $file = UploadedFile::fake()->image('favicon.png', 512, 512);

        $response = $this->post(route('admin.seo.update_global'), [
            'favicon' => $file,
        ]);

        $response->assertStatus(302);
        
        $this->assertFileExists(public_path('favicon-16x16.png'));
        $this->assertFileExists(public_path('favicon-32x32.png'));
        $this->assertFileExists(public_path('apple-touch-icon.png'));
        $this->assertFileExists(public_path('android-chrome-192x192.png'));
        $this->assertFileExists(public_path('android-chrome-512x512.png'));
        $this->assertFileExists(public_path('favicon.ico'));
        $this->assertFileExists(public_path('site.webmanifest'));
    }
}
