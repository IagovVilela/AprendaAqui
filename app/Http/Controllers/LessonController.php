<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    public function show($slug, Lesson $lesson)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        
        // Verificar se o usuário está matriculado
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return redirect()
                ->route('courses.show', $course->slug)
                ->with('error', 'Você precisa se matricular no curso para acessar as aulas.');
        }

        // Verificar se a aula pertence ao curso
        if ($lesson->module->course_id !== $course->id) {
            abort(404);
        }

        // Carregar curso com módulos e aulas
        $course->load(['modules.lessons' => function($query) {
            $query->where('is_published', true)->orderBy('order');
        }]);

        // Marcar como visualizada
        $lesson->increment('views_count');

        // Verificar progresso
        $progress = Progress::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'course_id' => $course->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'is_completed' => false,
                'time_watched' => 0,
            ]
        );

        // Próxima aula
        $nextLesson = $this->getNextLesson($course, $lesson);
        $previousLesson = $this->getPreviousLesson($course, $lesson);

        return view('lessons.show', compact('course', 'lesson', 'progress', 'nextLesson', 'previousLesson', 'enrollment'));
    }

    public function complete(Request $request, $slug, Lesson $lesson)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        
        $progress = Progress::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'course_id' => $course->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'is_completed' => true,
                'completed_at' => now(),
                'time_watched' => $request->time_watched ?? 0,
            ]
        );

        // Atualizar progresso do curso
        $this->updateCourseProgress($course);

        return response()->json([
            'success' => true,
            'message' => 'Aula concluída com sucesso!',
        ]);
    }

    public function pdf($slug, Lesson $lesson)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        
        // Verificar se o usuário está matriculado
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            abort(403, 'Você precisa se matricular no curso para acessar os materiais.');
        }

        // Verificar se a aula pertence ao curso
        if ($lesson->module->course_id !== $course->id) {
            abort(404);
        }

        // Verificar se o PDF existe
        if (!$lesson->pdf_file || !Storage::disk('public')->exists($lesson->pdf_file)) {
            abort(404, 'PDF não encontrado.');
        }

        // Retornar o arquivo PDF
        $filePath = Storage::disk('public')->path($lesson->pdf_file);
        $fileName = basename($lesson->pdf_file);

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
        ]);
    }

    private function getNextLesson(Course $course, Lesson $currentLesson)
    {
        $allLessons = $course->modules->flatMap->lessons->sortBy('order');
        $currentIndex = $allLessons->search(function($lesson) use ($currentLesson) {
            return $lesson->id === $currentLesson->id;
        });

        return $allLessons->values()->get($currentIndex + 1);
    }

    private function getPreviousLesson(Course $course, Lesson $currentLesson)
    {
        $allLessons = $course->modules->flatMap->lessons->sortBy('order');
        $currentIndex = $allLessons->search(function($lesson) use ($currentLesson) {
            return $lesson->id === $currentLesson->id;
        });

        return $currentIndex > 0 ? $allLessons->values()->get($currentIndex - 1) : null;
    }

    private function updateCourseProgress(Course $course)
    {
        $totalLessons = $course->modules->sum(fn($module) => $module->lessons->count());
        $completedLessons = Progress::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->where('is_completed', true)
            ->count();

        $progressPercentage = $totalLessons > 0 
            ? round(($completedLessons / $totalLessons) * 100) 
            : 0;

        Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->update(['progress_percentage' => $progressPercentage]);

        // Se completou 100%, marcar curso como completo
        if ($progressPercentage >= 100) {
            Enrollment::where('user_id', Auth::id())
                ->where('course_id', $course->id)
                ->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
        }
    }
}
