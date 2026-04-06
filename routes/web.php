<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\ModuleController as AdminModuleController;
use App\Http\Controllers\Admin\LessonController as AdminLessonController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Rotas de autenticação
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

// Rota de logout
Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
})->name('logout');

// Rotas públicas de cursos
Route::get('/cursos', [CourseController::class, 'index'])->name('courses.index');
Route::get('/cursos/{slug}', [CourseController::class, 'show'])->name('courses.show');

// Rotas protegidas por middleware de autenticação
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Matrículas
    Route::post('/cursos/{slug}/enroll', [EnrollmentController::class, 'enroll'])->name('courses.enroll');
    Route::get('/meus-cursos', [EnrollmentController::class, 'myCourses'])->name('courses.my-courses');
    
    // Aulas
    Route::get('/cursos/{slug}/aulas/{lesson}', [LessonController::class, 'show'])->name('lessons.show');
    Route::get('/cursos/{slug}/aulas/{lesson}/pdf', [LessonController::class, 'pdf'])->name('lessons.pdf');
    Route::post('/cursos/{slug}/aulas/{lesson}/complete', [LessonController::class, 'complete'])->name('lessons.complete');
});

// Rotas de administração (apenas para admins)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('courses', AdminCourseController::class);
    
    // Módulos
    Route::post('courses/{course}/modules', [AdminModuleController::class, 'store'])->name('modules.store');
    Route::put('courses/{course}/modules/{module}', [AdminModuleController::class, 'update'])->name('modules.update');
    Route::delete('courses/{course}/modules/{module}', [AdminModuleController::class, 'destroy'])->name('modules.destroy');
    
    // Aulas
    Route::post('courses/{course}/modules/{module}/lessons', [AdminLessonController::class, 'store'])->name('lessons.store');
    Route::put('courses/{course}/modules/{module}/lessons/{lesson}', [AdminLessonController::class, 'update'])->name('lessons.update');
    Route::delete('courses/{course}/modules/{module}/lessons/{lesson}', [AdminLessonController::class, 'destroy'])->name('lessons.destroy');
    Route::delete('courses/{course}/modules/{module}/lessons/{lesson}/attachments/{attachmentIndex}', [AdminLessonController::class, 'removeAttachment'])->name('lessons.remove-attachment');
});
