<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Course $course, Module $module)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'type' => 'required|in:video,text,quiz,assignment',
            'pdf_file' => 'nullable|file|mimes:pdf|max:10240', // 10MB max
            'order' => 'nullable|integer',
            'materials' => 'nullable|array',
            'materials.*.title' => 'nullable|string',
            'materials.*.url' => 'nullable|url',
            'attachments' => 'nullable|array',
        ];

        // Validação condicional baseada no tipo
        if ($request->type === 'video') {
            $rules['video_url'] = 'nullable|url';
            $rules['video_duration'] = 'nullable|string';
        } else if ($request->type === 'text') {
            $rules['content'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        $validated['module_id'] = $module->id;
        $validated['is_free'] = $request->boolean('is_free', false);
        $validated['is_published'] = $request->boolean('is_published', false);
        $validated['order'] = $validated['order'] ?? ($module->lessons()->max('order') ?? 0) + 1;

        // Upload de PDF
        if ($request->hasFile('pdf_file')) {
            $path = $request->file('pdf_file')->store('lessons/pdfs', 'public');
            $validated['pdf_file'] = $path;
        }

        // Processar materiais complementares (remover vazios)
        if (isset($validated['materials']) && is_array($validated['materials'])) {
            $materials = array_filter($validated['materials'], function($material) {
                return !empty($material['title']) && !empty($material['url']);
            });
            $validated['materials'] = !empty($materials) ? array_values($materials) : null;
        }

        // Upload de anexos
        if ($request->hasFile('attachments')) {
            $attachments = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('lessons/attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType(),
                ];
            }
            $validated['attachments'] = $attachments;
        }

        try {
            // Limpar campos vazios antes de salvar
            if (empty($validated['video_url'])) {
                unset($validated['video_url']);
            }
            if (empty($validated['video_duration'])) {
                unset($validated['video_duration']);
            }
            if (empty($validated['content'])) {
                unset($validated['content']);
            }
            
            $lesson = Lesson::create($validated);
            
            \Log::info('Aula criada com sucesso', [
                'lesson_id' => $lesson->id,
                'module_id' => $module->id,
                'course_id' => $course->id,
                'title' => $lesson->title
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors($e->errors())
                ->with('error', 'Erro de validação ao criar aula.');
        } catch (\Exception $e) {
            \Log::error('Erro ao criar aula', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Erro ao criar aula: ' . $e->getMessage());
        }

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Aula criada com sucesso!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course, Module $module, Lesson $lesson)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'type' => 'required|in:video,text,quiz,assignment',
            'pdf_file' => 'nullable|file|mimes:pdf|max:10240',
            'order' => 'nullable|integer',
            'materials' => 'nullable|array',
            'materials.*.title' => 'nullable|string',
            'materials.*.url' => 'nullable|url',
            'attachments' => 'nullable|array',
        ];

        // Validação condicional baseada no tipo
        if ($request->type === 'video') {
            $rules['video_url'] = 'nullable|url';
            $rules['video_duration'] = 'nullable|string';
        } else if ($request->type === 'text') {
            $rules['content'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        $validated['is_free'] = $request->boolean('is_free', false);
        $validated['is_published'] = $request->boolean('is_published', false);

        // Upload de novo PDF (substitui o antigo)
        if ($request->hasFile('pdf_file')) {
            // Remove PDF antigo se existir
            if ($lesson->pdf_file) {
                Storage::disk('public')->delete($lesson->pdf_file);
            }
            $path = $request->file('pdf_file')->store('lessons/pdfs', 'public');
            $validated['pdf_file'] = $path;
        }

        // Processar materiais complementares (remover vazios)
        if (isset($validated['materials']) && is_array($validated['materials'])) {
            $materials = array_filter($validated['materials'], function($material) {
                return !empty($material['title']) && !empty($material['url']);
            });
            $validated['materials'] = !empty($materials) ? array_values($materials) : null;
        }

        // Upload de novos anexos
        if ($request->hasFile('attachments')) {
            $attachments = $lesson->attachments ?? [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('lessons/attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType(),
                ];
            }
            $validated['attachments'] = $attachments;
        }

        try {
            $lesson->update($validated);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Erro ao atualizar aula: ' . $e->getMessage());
        }

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Aula atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course, Module $module, Lesson $lesson)
    {
        // Remove arquivos associados
        if ($lesson->pdf_file) {
            Storage::disk('public')->delete($lesson->pdf_file);
        }
        
        if ($lesson->attachments) {
            foreach ($lesson->attachments as $attachment) {
                Storage::disk('public')->delete($attachment['path'] ?? '');
            }
        }

        $lesson->delete();

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Aula excluída com sucesso!');
    }

    /**
     * Remove an attachment from a lesson.
     */
    public function removeAttachment(Course $course, Module $module, Lesson $lesson, $attachmentIndex)
    {
        $attachments = $lesson->attachments ?? [];
        
        if (isset($attachments[$attachmentIndex])) {
            Storage::disk('public')->delete($attachments[$attachmentIndex]['path'] ?? '');
            unset($attachments[$attachmentIndex]);
            $attachments = array_values($attachments); // Reindexa o array
            
            $lesson->update(['attachments' => $attachments]);
        }

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Anexo removido com sucesso!');
    }
}
