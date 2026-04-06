@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern">
        <!-- Flash Messages -->
        @if(session('success'))
            <div class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 animate-slide-down">
                <i class="fas fa-check-circle mr-2"></i>
                {{ session('success') }}
            </div>
        @endif

        @if(session('error'))
            <div class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-down">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ session('error') }}
            </div>
        @endif

        <!-- Course Header -->
        <div class="card-glass p-6 md:p-8 mb-8 animate-scale-in">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Image -->
                <div class="rounded-2xl overflow-hidden">
                    @if($course->image)
                        <img src="{{ $course->image }}" alt="{{ $course->title }}" class="w-full h-64 md:h-80 object-cover transition-transform duration-500 hover:scale-105">
                    @else
                        <div class="w-full h-64 md:h-80 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <i class="fas fa-code text-white text-8xl"></i>
                        </div>
                    @endif
                </div>
                
                <!-- Info -->
                <div>
                    <div class="flex items-center gap-2 mb-4 flex-wrap">
                        <span class="badge badge-primary">
                            {{ ucfirst($course->level) }}
                        </span>
                        <span class="badge badge-gray">
                            {{ ucfirst($course->category) }}
                        </span>
                    </div>
                    
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{{ $course->title }}</h1>
                    <p class="text-lg text-gray-600 mb-6 leading-relaxed">{{ $course->description }}</p>
                    
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-2xl font-bold text-blue-600">{{ $course->total_lessons }}</div>
                            <div class="text-sm text-gray-600 mt-1">Aulas</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-2xl font-bold text-blue-600">{{ $course->duration_hours ?? 0 }}h</div>
                            <div class="text-sm text-gray-600 mt-1">Duração</div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-2xl font-bold text-blue-600">{{ $course->enrollments()->count() }}</div>
                            <div class="text-sm text-gray-600 mt-1">Alunos</div>
                        </div>
                    </div>

                    @if($isEnrolled)
                        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4">
                            <div class="flex items-center mb-2">
                                <i class="fas fa-check-circle mr-2"></i>
                                <span class="font-semibold">Você está matriculado neste curso</span>
                            </div>
                            @if($enrollment)
                                <div class="mt-3">
                                    <div class="flex justify-between text-sm mb-2">
                                        <span>Progresso</span>
                                        <span class="font-bold">{{ $enrollment->progress_percentage }}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill bg-green-600" style="width: {{ $enrollment->progress_percentage }}%"></div>
                                    </div>
                                </div>
                            @endif
                        </div>
                        <a href="{{ route('courses.my-courses') }}" class="btn-primary w-full text-center block">
                            <i class="fas fa-play mr-2"></i>
                            Continuar Estudando
                        </a>
                    @else
                        <div class="mb-6">
                            <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                {{ $course->formatted_price }}
                            </div>
                        </div>
                        <form method="POST" action="{{ route('courses.enroll', ['slug' => $course->slug]) }}">
                            @csrf
                            <button type="submit" class="btn-primary w-full text-center flex items-center justify-center gap-2">
                                <i class="fas fa-user-plus"></i>
                                Matricular-se Agora
                            </button>
                        </form>
                    @endif
                </div>
            </div>
        </div>

        <!-- Course Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <!-- What You'll Learn -->
                @if($course->what_you_will_learn)
                    <div class="card-modern p-6 md:p-8 stagger-item">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fas fa-lightbulb text-yellow-500"></i>
                            O que você vai aprender
                        </h2>
                        <div class="prose max-w-none text-gray-600 whitespace-pre-line">
                            {{ $course->what_you_will_learn }}
                        </div>
                    </div>
                @endif

                <!-- Requirements -->
                @if($course->requirements)
                    <div class="card-modern p-6 md:p-8 stagger-item">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fas fa-list-check text-blue-500"></i>
                            Requisitos
                        </h2>
                        <div class="prose max-w-none text-gray-600 whitespace-pre-line">
                            {{ $course->requirements }}
                        </div>
                    </div>
                @endif

                <!-- Course Modules -->
                <div class="card-modern p-6 md:p-8 stagger-item">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <i class="fas fa-list text-indigo-500"></i>
                        Conteúdo do Curso
                    </h2>
                    <div class="space-y-4">
                        @forelse($course->modules as $module)
                            <div class="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                                <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-4 font-semibold text-gray-900 flex items-center gap-2">
                                    <i class="fas fa-folder text-blue-600"></i>
                                    {{ $module->title }}
                                </div>
                                <div class="divide-y divide-gray-100">
                                    @forelse($module->lessons as $lesson)
                                        @if($isEnrolled && $lesson->is_published)
                                            <a href="{{ route('lessons.show', [$course->slug, $lesson->id]) }}" class="block px-5 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer">
                                                <div class="flex items-center gap-3 flex-1">
                                                    @if($lesson->type === 'video')
                                                        <i class="fas fa-play-circle text-blue-600 text-lg"></i>
                                                    @elseif($lesson->type === 'text')
                                                        <i class="fas fa-file-alt text-gray-600 text-lg"></i>
                                                    @elseif($lesson->type === 'quiz')
                                                        <i class="fas fa-question-circle text-yellow-600 text-lg"></i>
                                                    @else
                                                        <i class="fas fa-tasks text-green-600 text-lg"></i>
                                                    @endif
                                                    <span class="text-gray-900 font-medium hover:text-blue-600">{{ $lesson->title }}</span>
                                                    @if($lesson->is_free)
                                                        <span class="badge badge-success text-xs">Gratuita</span>
                                                    @endif
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    @if($lesson->video_duration)
                                                        <span class="text-sm text-gray-500">{{ $lesson->video_duration }}</span>
                                                    @endif
                                                    <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
                                                </div>
                                            </a>
                                        @else
                                            <div class="px-5 py-4 flex items-center justify-between {{ (!$isEnrolled || !$lesson->is_published) ? 'opacity-60' : '' }}">
                                                <div class="flex items-center gap-3 flex-1">
                                                    @if($lesson->type === 'video')
                                                        <i class="fas fa-play-circle text-blue-600 text-lg"></i>
                                                    @elseif($lesson->type === 'text')
                                                        <i class="fas fa-file-alt text-gray-600 text-lg"></i>
                                                    @elseif($lesson->type === 'quiz')
                                                        <i class="fas fa-question-circle text-yellow-600 text-lg"></i>
                                                    @else
                                                        <i class="fas fa-tasks text-green-600 text-lg"></i>
                                                    @endif
                                                    <span class="text-gray-900 font-medium">{{ $lesson->title }}</span>
                                                    @if($lesson->is_free)
                                                        <span class="badge badge-success text-xs">Gratuita</span>
                                                    @endif
                                                    @if(!$lesson->is_published)
                                                        <span class="badge badge-gray text-xs">Não publicada</span>
                                                    @endif
                                                    @if(!$isEnrolled)
                                                        <span class="badge badge-primary text-xs">Matricule-se para acessar</span>
                                                    @endif
                                                </div>
                                                @if($lesson->video_duration)
                                                    <span class="text-sm text-gray-500 ml-4">{{ $lesson->video_duration }}</span>
                                                @endif
                                            </div>
                                        @endif
                                    @empty
                                        <div class="px-5 py-4 text-gray-500 text-sm">Nenhuma aula neste módulo</div>
                                    @endforelse
                                </div>
                            </div>
                        @empty
                            <div class="text-center py-12 text-gray-500">
                                <i class="fas fa-folder-open text-4xl mb-4"></i>
                                <p>Nenhum módulo cadastrado ainda</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Instructor -->
                @if($course->instructor)
                    <div class="card-modern p-6 stagger-item">
                        <h3 class="text-xl font-bold text-gray-900 mb-4">Instrutor</h3>
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {{ strtoupper(substr($course->instructor->name, 0, 1)) }}
                            </div>
                            <div>
                                <div class="font-semibold text-gray-900">{{ $course->instructor->name }}</div>
                                <div class="text-sm text-gray-600">Instrutor</div>
                            </div>
                        </div>
                    </div>
                @endif

                <!-- Course Info -->
                <div class="card-modern p-6 stagger-item">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Informações</h3>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Nível:</span>
                            <span class="badge badge-primary">{{ ucfirst($course->level) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Categoria:</span>
                            <span class="font-semibold text-gray-900">{{ ucfirst($course->category) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Aulas:</span>
                            <span class="font-semibold text-gray-900">{{ $course->total_lessons }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Duração:</span>
                            <span class="font-semibold text-gray-900">{{ $course->duration_hours ?? 0 }} horas</span>
                        </div>
                        @if($course->rating > 0)
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Avaliação:</span>
                                <span class="font-semibold text-yellow-600">
                                    {{ number_format($course->rating, 1) }} ⭐
                                </span>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Related Courses -->
        @if($relatedCourses->count() > 0)
            <div class="mt-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Cursos Relacionados</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    @foreach($relatedCourses as $index => $relatedCourse)
                        <a href="{{ route('courses.show', $relatedCourse->slug) }}" class="card-modern overflow-hidden stagger-item hover-lift" style="animation-delay: {{ $index * 0.1 }}s">
                            @if($relatedCourse->image)
                                <div class="h-32 overflow-hidden">
                                    <img src="{{ $relatedCourse->image }}" alt="{{ $relatedCourse->title }}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                                </div>
                            @else
                                <div class="h-32 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                            @endif
                            <div class="p-4">
                                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">{{ $relatedCourse->title }}</h3>
                                <div class="text-blue-600 font-semibold">{{ $relatedCourse->formatted_price }}</div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
