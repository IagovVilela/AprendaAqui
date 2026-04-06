@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern">
        <!-- Header -->
        <div class="mb-8 animate-slide-down">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Meus Cursos
            </h1>
            <p class="text-gray-600 text-lg">Gerencie seus cursos e continue aprendendo</p>
        </div>

        @if($enrollments->count() > 0)
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                @foreach($enrollments as $index => $enrollment)
                    <div class="card-modern overflow-hidden stagger-item hover-lift" style="animation-delay: {{ $index * 0.1 }}s">
                        @if($enrollment->course->image)
                            <div class="relative h-48 overflow-hidden">
                                <img src="{{ $enrollment->course->image }}" alt="{{ $enrollment->course->title }}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                            </div>
                        @else
                            <div class="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <i class="fas fa-code text-white text-6xl"></i>
                            </div>
                        @endif
                        
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-3">
                                <h3 class="text-xl font-bold text-gray-900 line-clamp-2 flex-1">{{ $enrollment->course->title }}</h3>
                                @if($enrollment->status === 'completed')
                                    <span class="badge badge-success ml-2 whitespace-nowrap">
                                        <i class="fas fa-check-circle mr-1"></i> Concluído
                                    </span>
                                @else
                                    <span class="badge badge-primary ml-2 whitespace-nowrap">
                                        Em andamento
                                    </span>
                                @endif
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between text-sm text-gray-600 mb-2">
                                    <span class="font-medium">Progresso</span>
                                    <span class="font-bold text-blue-600">{{ $enrollment->progress_percentage }}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: {{ $enrollment->progress_percentage }}%"></div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span><i class="far fa-calendar mr-1"></i> {{ $enrollment->created_at->format('d/m/Y') }}</span>
                                @if($enrollment->course->duration_hours)
                                    <span><i class="far fa-clock mr-1"></i> {{ $enrollment->course->duration_hours }}h</span>
                                @endif
                            </div>

                            <a href="{{ route('courses.show', $enrollment->course->slug) }}" class="btn-primary w-full text-center block">
                                <i class="fas fa-play mr-2"></i>
                                {{ $enrollment->status === 'completed' ? 'Revisar Curso' : 'Continuar Estudando' }}
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex justify-center">
                {{ $enrollments->links() }}
            </div>
        @else
            <div class="card-glass p-12 text-center animate-scale-in">
                <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-book-open text-gray-400 text-5xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Você ainda não está matriculado em nenhum curso</h2>
                <p class="text-gray-600 mb-6">Explore nossos cursos e comece sua jornada na programação!</p>
                <a href="{{ route('courses.index') }}" class="btn-primary inline-flex items-center gap-2">
                    <i class="fas fa-search"></i>
                    Ver Cursos Disponíveis
                </a>
            </div>
        @endif
    </div>
</div>
@endsection
