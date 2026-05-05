<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
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

    public function test_admin_is_redirected_to_course_content_page_after_creating_course()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);

        $response = $this
            ->actingAs($admin)
            ->post(route('admin.courses.store'), [
                'title' => 'New Admin Course',
                'description' => 'Course description',
                'price' => 12000,
            ]);

        $course = Course::where('title', 'New Admin Course')->firstOrFail();

        $response->assertRedirect(route('admin.courses.show', $course));
    }

    public function test_guest_is_redirected_to_login_from_checkout_route()
    {
        $course = Course::create([
            'title' => 'Paid Course',
            'price' => 5000,
            'is_active' => true,
        ]);

        $response = $this->get(route('payment.checkout', $course));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_is_redirected_to_payment_gateway_from_checkout_route()
    {
        Http::fake([
            'https://kvant-psiholog.payform.ru/*' => Http::response('', 302, [
                'Location' => 'https://secure.payform.ru/mock-checkout',
            ]),
        ]);

        config()->set('services.prodamus.url', 'https://kvant-psiholog.payform.ru');
        config()->set('services.prodamus.secret_key', 'test-secret');

        $user = User::factory()->create();
        $course = Course::create([
            'title' => 'Paid Course',
            'price' => 5000,
            'is_active' => true,
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('payment.checkout', $course));

        $response->assertRedirect('https://secure.payform.ru/mock-checkout');
        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'pending',
        ]);
    }

    public function test_admin_can_create_lesson_even_when_content_length_header_is_large()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $course = Course::create(['title' => 'Admin Course', 'price' => 0, 'is_active' => true]);
        $module = Module::create(['course_id' => $course->id, 'title' => 'Module 1', 'order' => 1]);

        $response = $this
            ->actingAs($admin)
            ->withServerVariables(['CONTENT_LENGTH' => 600 * 1024 * 1024])
            ->post(route('admin.lessons.store', $module->id), [
                'title' => 'Lesson from upload form',
                'content' => '<p>content</p>',
            ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('lessons', [
            'module_id' => $module->id,
            'title' => 'Lesson from upload form',
        ]);
    }

    public function test_admin_can_update_lesson_even_when_content_length_header_is_large()
    {
        $admin = User::factory()->create(['email' => 'admin@admin.com']);
        $course = Course::create(['title' => 'Admin Course', 'price' => 0, 'is_active' => true]);
        $module = Module::create(['course_id' => $course->id, 'title' => 'Module 1', 'order' => 1]);
        $lesson = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Old lesson title',
            'content' => '<p>old</p>',
            'order' => 1,
        ]);

        $response = $this
            ->actingAs($admin)
            ->withServerVariables(['CONTENT_LENGTH' => 600 * 1024 * 1024])
            ->post(route('admin.lessons.update', $lesson->id), [
                'title' => 'Updated lesson title',
                'content' => '<p>new</p>',
            ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('lessons', [
            'id' => $lesson->id,
            'title' => 'Updated lesson title',
            'content' => '<p>new</p>',
        ]);
    }
}
