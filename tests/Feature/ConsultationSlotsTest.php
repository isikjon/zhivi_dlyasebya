<?php

namespace Tests\Feature;

use App\Models\ConsultationSlot;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsultationSlotsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_consultation_slot_for_next_week(): void
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);

        $response = $this
            ->actingAs($admin)
            ->post(route('admin.consultation-slots.store'), [
                'slot_date' => now()->addDay()->toDateString(),
                'slot_time' => '12:00',
            ]);

        $response->assertRedirect();

        $this->assertTrue(
            ConsultationSlot::query()
                ->whereDate('slot_date', now()->addDay()->toDateString())
                ->where('slot_time', '12:00:00')
                ->where('is_active', true)
                ->exists()
        );
    }

    public function test_user_can_book_active_consultation_slot_and_slot_becomes_inactive(): void
    {
        $slot = ConsultationSlot::create([
            'slot_date' => now()->addDay()->toDateString(),
            'slot_time' => '10:00:00',
            'is_active' => true,
        ]);

        $response = $this->post(route('consultation.store'), [
            'name' => 'Тест',
            'contact' => '@test',
            'date' => $slot->slot_date->toDateString(),
            'time' => '10:00',
            'request' => 'Проверка',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('consultations', [
            'consultation_slot_id' => $slot->id,
            'date' => $slot->slot_date->toDateString(),
            'time' => '10:00',
        ]);

        $this->assertDatabaseHas('consultation_slots', [
            'id' => $slot->id,
            'is_active' => false,
        ]);
    }

    public function test_user_cannot_book_inactive_or_missing_slot(): void
    {
        $response = $this
            ->from('/')
            ->post(route('consultation.store'), [
                'name' => 'Тест',
                'contact' => '@test',
                'date' => now()->addDay()->toDateString(),
                'time' => '11:00',
                'request' => 'Проверка',
            ]);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors('time');

        $this->assertDatabaseCount('consultations', 0);
    }
}
