@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern max-w-4xl">
        <!-- Header -->
        <div class="mb-8 animate-slide-down">
            <a href="{{ route('admin.courses.index') }}" class="btn-ghost inline-flex items-center gap-2 mb-4">
                <i class="fas fa-arrow-left"></i>
                Voltar para lista de cursos
            </a>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Editar Curso
            </h1>
            <p class="text-gray-600 text-lg">Atualize as informações do curso</p>
        </div>

        <!-- Formulário -->
        <form method="POST" action="{{ route('admin.courses.update', $course) }}" class="card-glass p-6 md:p-8 animate-scale-in">
            @csrf
            @method('PUT')

            <!-- Título -->
            <div class="mb-6">
                <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                    Título do Curso <span class="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value="{{ old('title', $course->title) }}"
                    class="input-modern @error('title') border-red-500 focus:ring-red-500 @enderror"
                    required
                >
                @error('title')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Descrição Curta -->
            <div class="mb-6">
                <label for="short_description" class="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição Curta
                </label>
                <textarea 
                    id="short_description" 
                    name="short_description" 
                    rows="2"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('short_description') border-red-500 @enderror"
                >{{ old('short_description', $course->short_description) }}</textarea>
                @error('short_description')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Descrição Completa -->
            <div class="mb-6">
                <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição Completa <span class="text-red-500">*</span>
                </label>
                <textarea 
                    id="description" 
                    name="description" 
                    rows="5"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('description') border-red-500 @enderror"
                    required
                >{{ old('description', $course->description) }}</textarea>
                @error('description')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Grid: Categoria e Nível -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">
                        Categoria <span class="text-red-500">*</span>
                    </label>
                    <select 
                        id="category" 
                        name="category"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('category') border-red-500 @enderror"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="programming" {{ old('category', $course->category) == 'programming' ? 'selected' : '' }}>Programação</option>
                        <option value="design" {{ old('category', $course->category) == 'design' ? 'selected' : '' }}>Design</option>
                        <option value="business" {{ old('category', $course->category) == 'business' ? 'selected' : '' }}>Negócios</option>
                        <option value="data-science" {{ old('category', $course->category) == 'data-science' ? 'selected' : '' }}>Ciência de Dados</option>
                        <option value="mobile" {{ old('category', $course->category) == 'mobile' ? 'selected' : '' }}>Mobile</option>
                        <option value="devops" {{ old('category', $course->category) == 'devops' ? 'selected' : '' }}>DevOps</option>
                    </select>
                    @error('category')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="level" class="block text-sm font-semibold text-gray-700 mb-2">
                        Nível <span class="text-red-500">*</span>
                    </label>
                    <select 
                        id="level" 
                        name="level"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('level') border-red-500 @enderror"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="beginner" {{ old('level', $course->level) == 'beginner' ? 'selected' : '' }}>Iniciante</option>
                        <option value="intermediate" {{ old('level', $course->level) == 'intermediate' ? 'selected' : '' }}>Intermediário</option>
                        <option value="advanced" {{ old('level', $course->level) == 'advanced' ? 'selected' : '' }}>Avançado</option>
                    </select>
                    @error('level')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Grid: Preço e Duração -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label for="price" class="block text-sm font-semibold text-gray-700 mb-2">
                        Preço (R$)
                    </label>
                    <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        step="0.01"
                        min="0"
                        value="{{ old('price', $course->price) }}"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('price') border-red-500 @enderror"
                    >
                    @error('price')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="duration_hours" class="block text-sm font-semibold text-gray-700 mb-2">
                        Duração (horas)
                    </label>
                    <input 
                        type="number" 
                        id="duration_hours" 
                        name="duration_hours" 
                        min="0"
                        value="{{ old('duration_hours', $course->duration_hours) }}"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('duration_hours') border-red-500 @enderror"
                    >
                    @error('duration_hours')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Checkboxes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="flex items-center">
                    <input type="hidden" name="is_free" value="0">
                    <input 
                        type="checkbox" 
                        id="is_free" 
                        name="is_free" 
                        value="1"
                        {{ old('is_free', $course->is_free) ? 'checked' : '' }}
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                    <label for="is_free" class="ml-2 text-sm font-medium text-gray-700">
                        Curso Gratuito
                    </label>
                </div>

                <div class="flex items-center">
                    <input type="hidden" name="is_published" value="0">
                    <input 
                        type="checkbox" 
                        id="is_published" 
                        name="is_published" 
                        value="1"
                        {{ old('is_published', $course->is_published) ? 'checked' : '' }}
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                    <label for="is_published" class="ml-2 text-sm font-medium text-gray-700">
                        Publicar Imediatamente
                    </label>
                </div>
            </div>

            <!-- O que você vai aprender -->
            <div class="mb-6">
                <label for="what_you_will_learn" class="block text-sm font-semibold text-gray-700 mb-2">
                    O que você vai aprender
                </label>
                <textarea 
                    id="what_you_will_learn" 
                    name="what_you_will_learn" 
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('what_you_will_learn') border-red-500 @enderror"
                >{{ old('what_you_will_learn', $course->what_you_will_learn) }}</textarea>
                @error('what_you_will_learn')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Requisitos -->
            <div class="mb-6">
                <label for="requirements" class="block text-sm font-semibold text-gray-700 mb-2">
                    Requisitos
                </label>
                <textarea 
                    id="requirements" 
                    name="requirements" 
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('requirements') border-red-500 @enderror"
                >{{ old('requirements', $course->requirements) }}</textarea>
                @error('requirements')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Tags -->
            <div class="mb-6">
                <label for="tags" class="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                </label>
                <input 
                    type="text" 
                    id="tags" 
                    name="tags" 
                    value="{{ old('tags', $course->tags) }}"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent @error('tags') border-red-500 @enderror"
                    placeholder="Ex: JavaScript, React, Node.js (separadas por vírgula)"
                >
                <p class="mt-2 text-xs text-gray-500">Separe as tags por vírgula</p>
                @error('tags')
                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Botões -->
            <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <a href="{{ route('admin.courses.index') }}" class="btn-secondary">
                    Cancelar
                </a>
                <button type="submit" class="btn-primary inline-flex items-center gap-2">
                    <i class="fas fa-save"></i>
                    Atualizar Curso
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

