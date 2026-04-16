<?php

use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\ConsultationSlotController as AdminConsultationSlotController;
use App\Http\Controllers\Admin\LessonController as AdminLessonController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

$activeCourses = static function () {
    try {
        if (! Schema::hasTable('courses')) {
            return collect();
        }

        return \App\Models\Course::where('is_active', true)->get();
    } catch (\Throwable) {
        return collect();
    }
};

$homeContent = static function () {
    try {
        if (! Schema::hasTable('site_contents')) {
            return [];
        }

        return \App\Http\Controllers\Admin\ContentController::getContent('home');
    } catch (\Throwable) {
        return [];
    }
};

Route::get('/', function () use ($activeCourses, $homeContent) {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'courses' => $activeCourses(),
        'siteContent' => $homeContent(),
    ]);
});

Route::get('/catalog', function () use ($activeCourses) {
    return Inertia::render('Catalog', [
        'courses' => $activeCourses(),
    ]);
})->name('catalog');

Route::get('/live-yourself', function () use ($activeCourses) {
    return Inertia::render('LiveYourself', [
        'courses' => $activeCourses(),
    ]);
})->name('live-yourself');

Route::get('/archetypes', function () use ($activeCourses) {
    return Inertia::render('Archetypes', [
        'courses' => $activeCourses(),
    ]);
})->name('archetypes');

Route::get('/program/{id}', function ($id) use ($activeCourses) {
    return Inertia::render('Program', [
        'id' => $id,
        'courses' => $activeCourses(),
    ]);
})->name('program.show');

Route::get('/thank-you', function () {
    return Inertia::render('ThankYou');
})->name('thank-you');

// Личный кабинет ученика
Route::middleware(['auth', 'verified'])->prefix('cabinet')->name('cabinet.')->group(function () {
    Route::get('/dashboard', [CourseController::class, 'index'])->name('index');
    Route::get('/course/{course}', [CourseController::class, 'show'])->name('course.show');
    Route::post('/course/{course}/enroll', [CourseController::class, 'enroll'])->name('course.enroll');
    Route::get('/lesson/{lesson}', [CourseController::class, 'showLesson'])->name('lesson.show');
    Route::post('/lesson/{lesson}/complete', [CourseController::class, 'completeLesson'])->name('lesson.complete');

    // Профиль внутри кабинета (для текущего UI)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Совместимость со стандартными маршрутами Breeze и тестами
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    return redirect()->route('cabinet.index');
})->name('dashboard');

// Оплата через Prodamus
Route::middleware(['auth'])->group(function () {
    Route::post('/payment/course/{course}', [\App\Http\Controllers\PaymentController::class, 'initiate'])->name('payment.initiate');
    Route::get('/payment/success/{orderId}', [\App\Http\Controllers\PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/return/{orderId}', [\App\Http\Controllers\PaymentController::class, 'returnPage'])->name('payment.return');
    Route::get('/payment/history', [\App\Http\Controllers\PaymentController::class, 'history'])->name('payment.history');
});

// Webhook Prodamus (без CSRF, без auth)
Route::post('/webhook/prodamus', [\App\Http\Controllers\ProdamusWebhookController::class, 'handle'])->name('prodamus.webhook');

// Новые пути для входа и регистрации в стиле фронта
Route::middleware('guest')->group(function () {
    Route::get('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
    Route::get('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
});

// Админка
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard'); // Создадим позже или переиспользуем
    })->name('dashboard');
    
    Route::get('/courses', [AdminCourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [AdminCourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [AdminCourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [AdminCourseController::class, 'show'])->name('courses.show');
    Route::get('/courses/{course}/edit', [AdminCourseController::class, 'edit'])->name('courses.edit');
    Route::post('/courses/{course}', [AdminCourseController::class, 'update'])->name('courses.update');
    Route::put('/courses/{course}', [AdminCourseController::class, 'update']);
    Route::patch('/courses/{course}', [AdminCourseController::class, 'update']);
    Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy'])->name('courses.destroy');
    
    // Модули
    Route::post('/courses/{course}/modules', [\App\Http\Controllers\Admin\ModuleController::class, 'store'])->name('modules.store');
    Route::put('/modules/{module}', [\App\Http\Controllers\Admin\ModuleController::class, 'update'])->name('modules.update');
    Route::delete('/modules/{module}', [\App\Http\Controllers\Admin\ModuleController::class, 'destroy'])->name('modules.destroy');
    
    // Платежи
    Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');

    // Пользователи
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/toggle-block', [AdminUserController::class, 'toggleBlock'])->name('users.toggle-block');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    
    // Контент (Редактирование лендинга)
    Route::get('/content', [\App\Http\Controllers\Admin\ContentController::class, 'index'])->name('content.index');
    Route::post('/content/update', [\App\Http\Controllers\Admin\ContentController::class, 'update'])->name('content.update');
    Route::post('/content/update-by-key', [\App\Http\Controllers\Admin\ContentController::class, 'updateByKey'])->name('content.update_by_key');
    
    // SEO
    Route::get('/seo', [\App\Http\Controllers\Admin\SeoController::class, 'index'])->name('seo.index');
    Route::post('/seo/page/{page}', [\App\Http\Controllers\Admin\SeoController::class, 'updatePage'])->name('seo.update_page');
    Route::post('/seo/global', [\App\Http\Controllers\Admin\SeoController::class, 'updateGlobal'])->name('seo.update_global');
    Route::post('/seo/sitemap', [\App\Http\Controllers\Admin\SeoController::class, 'generateSitemap'])->name('seo.generate_sitemap');

    // Свободные слоты консультаций
    Route::get('/consultation-slots', [AdminConsultationSlotController::class, 'index'])->name('consultation-slots.index');
    Route::post('/consultation-slots', [AdminConsultationSlotController::class, 'store'])->name('consultation-slots.store');
    Route::delete('/consultation-slots', [AdminConsultationSlotController::class, 'destroy'])->name('consultation-slots.destroy');
    
    // Уроки
    Route::post('/modules/{module}/lessons', [AdminLessonController::class, 'store'])->name('lessons.store');
    Route::post('/lessons/{lesson}', [AdminLessonController::class, 'update'])->name('lessons.update');
    Route::delete('/lessons/{lesson}', [AdminLessonController::class, 'destroy'])->name('lessons.destroy');
    Route::delete('/lesson-assets/{asset}', [AdminLessonController::class, 'removeAsset'])->name('lessons.remove-asset');
});

// Стриминг медиа с поддержкой перемотки
Route::get('/stream/{path}', [\App\Http\Controllers\StreamController::class, 'stream'])
    ->where('path', '.*')
    ->name('stream');

Route::post('/consultation', [\App\Http\Controllers\ConsultationController::class, 'store'])->name('consultation.store');

require __DIR__.'/auth.php';
