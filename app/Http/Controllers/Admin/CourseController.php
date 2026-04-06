<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with(['instructor'])
            ->withCount('enrollments')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return view('admin.courses.index', compact('courses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.courses.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'price' => 'nullable|numeric|min:0',
            'duration_hours' => 'nullable|integer|min:0',
            'what_you_will_learn' => 'nullable|string',
            'requirements' => 'nullable|string',
            'tags' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['instructor_id'] = Auth::id();
        $validated['is_free'] = $request->boolean('is_free', false);
        $validated['is_published'] = $request->boolean('is_published', false);
        $validated['price'] = $validated['is_free'] ? 0 : ($validated['price'] ?? 0);
        
        // Converter tags de string para array
        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        }

        // Garantir slug único
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Course::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $course = Course::create($validated);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Curso criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load(['modules.lessons' => function($query) {
            $query->orderBy('order');
        }, 'instructor']);
        $course->modules->load(['lessons' => function($query) {
            $query->orderBy('order');
        }]);
        return view('admin.courses.show', compact('course'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        // Converter tags de array para string
        if (is_array($course->tags)) {
            $course->tags = implode(', ', $course->tags);
        }
        
        return view('admin.courses.edit', compact('course'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'price' => 'nullable|numeric|min:0',
            'duration_hours' => 'nullable|integer|min:0',
            'what_you_will_learn' => 'nullable|string',
            'requirements' => 'nullable|string',
            'tags' => 'nullable|string',
        ]);

        // Atualizar slug se o título mudou
        if ($course->title !== $validated['title']) {
            $newSlug = Str::slug($validated['title']);
            $originalSlug = $newSlug;
            $counter = 1;
            while (Course::where('slug', $newSlug)->where('id', '!=', $course->id)->exists()) {
                $newSlug = $originalSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $newSlug;
        }

        $validated['is_free'] = $request->boolean('is_free', false);
        $validated['is_published'] = $request->boolean('is_published', false);
        $validated['price'] = $validated['is_free'] ? 0 : ($validated['price'] ?? 0);
        
        // Converter tags de string para array
        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        }

        $course->update($validated);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Curso atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Curso excluído com sucesso!');
    }
}
