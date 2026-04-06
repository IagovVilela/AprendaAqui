<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnrollmentController extends Controller
{
    public function enroll($slug)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        
        // Verificar se já está matriculado
        $existingEnrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if ($existingEnrollment) {
            return redirect()
                ->route('courses.show', $course->slug)
                ->with('info', 'Você já está matriculado neste curso!');
        }

        // Criar matrícula
        Enrollment::create([
            'user_id' => Auth::id(),
            'course_id' => $course->id,
            'status' => 'active',
            'progress_percentage' => 0,
        ]);

        // Atualizar contador de matrículas
        $course->increment('enrollments_count');

        return redirect()
            ->route('courses.show', $course->slug)
            ->with('success', 'Matrícula realizada com sucesso! Bem-vindo ao curso!');
    }

    public function myCourses()
    {
        $enrollments = Enrollment::where('user_id', Auth::id())
            ->with(['course.instructor', 'course.modules'])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return view('courses.my-courses', compact('enrollments'));
    }
}
