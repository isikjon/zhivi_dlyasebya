<?php

use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\LessonController as AdminLessonController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'courses' => \App\Models\Course::where('is_active', true)->get(),
        'siteContent' => \App\Http\Controllers\Admin\ContentController::getContent('home'),
    ]);
});

Route::get('/catalog', function () {
    return Inertia::render('Catalog', [
        'courses' => \App\Models\Course::where('is_active', true)->get(),
    ]);
})->name('catalog');

    // Личный кабинет ученика
    Route::middleware(['auth', 'verified'])->prefix('cabinet')->name('cabinet.')->group(function () {
        Route::get('/dashboard', [CourseController::class, 'index'])->name('index');
        Route::get('/course/{course}', [CourseController::class, 'show'])->name('course.show');
        Route::get('/lesson/{lesson}', [CourseController::class, 'showLesson'])->name('lesson.show');
        
        // Профиль внутри кабинета
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Новые пути для входа и регистрации в стиле фронта
    Route::middleware('guest')->group(function () {
        Route::get('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
        Route::get('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])->name('register');
        Route::post('register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
    });

// Админка
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard'); // Создадим позже или переиспользуем
    })->name('dashboard');
    
    Route::get('/courses', [AdminCourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [AdminCourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [AdminCourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [AdminCourseController::class, 'show'])->name('courses.show');
    
    // Модули
    Route::post('/courses/{course}/modules', [\App\Http\Controllers\Admin\ModuleController::class, 'store'])->name('modules.store');
    Route::delete('/modules/{module}', [\App\Http\Controllers\Admin\ModuleController::class, 'destroy'])->name('modules.destroy');
    
    // Пользователи
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/toggle-block', [AdminUserController::class, 'toggleBlock'])->name('users.toggle-block');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    
    // Контент (Редактирование лендинга)
    Route::get('/content', [\App\Http\Controllers\Admin\ContentController::class, 'index'])->name('content.index');
    Route::post('/content/update', [\App\Http\Controllers\Admin\ContentController::class, 'update'])->name('content.update');
    Route::post('/content/update-by-key', [\App\Http\Controllers\Admin\ContentController::class, 'updateByKey'])->name('content.update_by_key');
    
    Route::post('/modules/{module}/lessons', [AdminLessonController::class, 'store'])->name('lessons.store');
});

require __DIR__.'/auth.php';
