<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseLmsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_see_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('cabinet.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Cabinet/Dashboard')
            ->has('myCourses')
            ->has('availableCourses')
        );
    }

    public function test_user_can_enroll_in_free_course()
    {
        $user = User::factory()->create();
        $course = Course::create([
            'title' => 'Free Course',
            'price' => 0,
            'is_active' => true
        ]);

        $this->actingAs($user);
        $response = $this->post(route('cabinet.course.enroll', $course->id));

        $response->assertRedirect(route('cabinet.course.show', $course->id));
        $this->assertDatabaseHas('enrollments', [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'is_active' => true
        ]);
    }

    public function test_user_can_complete_lesson()
    {
        $user = User::factory()->create();
        $course = Course::create(['title' => 'Test Course', 'price' => 0, 'is_active' => true]);
        $module = Module::create(['course_id' => $course->id, 'title' => 'Module 1', 'order' => 1]);
        $lesson = Lesson::create(['module_id' => $module->id, 'title' => 'Lesson 1', 'order' => 1]);

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'is_active' => true,
            'enrolled_at' => now()
        ]);

        $this->actingAs($user);
        $response = $this->post(route('cabinet.lesson.complete', $lesson->id));

        $response->assertStatus(302); // back()
        $this->assertDatabaseHas('lesson_progress', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'is_completed' => true
        ]);
    }

    public function test_admin_can_access_admin_dashboard()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $this->actingAs($admin);

        $response = $this->get(route('admin.dashboard'));
        $response->assertStatus(200);
    }

    public function test_seo_settings_can_be_updated()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $this->actingAs($admin);

        $response = $this->post(route('admin.seo.update_page', 'home'), [
            'title' => 'New Home Title',
            'description' => 'New Home Description',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('seo_settings', [
            'page' => 'home',
            'title' => 'New Home Title'
        ]);
    }

    public function test_global_seo_settings_can_be_updated()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $this->actingAs($admin);

        $response = $this->post(route('admin.seo.update_global'), [
            'robots_txt' => 'User-agent: *',
            'head_scripts' => '<script>console.log("head")</script>',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('global_settings', [
            'key' => 'robots_txt',
            'value' => 'User-agent: *'
        ]);
        $this->assertDatabaseHas('global_settings', [
            'key' => 'head_scripts',
            'value' => '<script>console.log("head")</script>'
        ]);
    }
}
