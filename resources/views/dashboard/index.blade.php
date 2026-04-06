@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern">
        <!-- Header Section -->
        <div class="mb-8 animate-slide-down">
            <div class="card-glass p-6 md:p-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <i class="fas fa-tachometer-alt"></i>
                            Dashboard
                        </div>
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Olá, <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ Auth::user()->name }}</span>! 👋
                        </h1>
                        <p class="text-gray-600 text-lg">Continue sua jornada de aprendizado</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right hidden sm:block">
                            <p class="text-xs text-gray-500 uppercase tracking-wide">Membro desde</p>
                            <p class="text-sm font-semibold text-gray-900">{{ Auth::user()->created_at->format('d/m/Y') }}</p>
                        </div>
                        <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card-modern p-6 stagger-item hover-lift">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total de Cursos</p>
                        <p class="text-4xl font-bold text-gray-900 mb-2">{{ $totalCourses }}</p>
                        <p class="text-xs text-gray-500">Cursos matriculados</p>
                    </div>
                    <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i class="fas fa-book text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="card-modern p-6 stagger-item hover-lift">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Concluídos</p>
                        <p class="text-4xl font-bold text-gray-900 mb-2">{{ $completedCourses }}</p>
                        <p class="text-xs text-gray-500">
                            @if($totalCourses > 0)
                                {{ round(($completedCourses / $totalCourses) * 100) }}% do total
                            @else
                                Nenhum curso ainda
                            @endif
                        </p>
                    </div>
                    <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="card-modern p-6 stagger-item hover-lift">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Em Andamento</p>
                        <p class="text-4xl font-bold text-gray-900 mb-2">{{ $totalCourses - $completedCourses }}</p>
                        <p class="text-xs text-gray-500">Continue estudando</p>
                    </div>
                    <div class="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <i class="fas fa-clock text-yellow-600 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- My Courses Section -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-6 animate-slide-down">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Meus Cursos</h2>
                    <p class="text-sm text-gray-500 mt-1">Continue de onde parou</p>
                </div>
                <a href="{{ route('courses.my-courses') }}" class="btn-ghost flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600">
                    Ver todos
                    <i class="fas fa-arrow-right text-sm"></i>
                </a>
            </div>
            
            @if($enrollments->count() > 0)
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @foreach($enrollments as $index => $enrollment)
                        <div class="card-modern overflow-hidden stagger-item" style="animation-delay: {{ $index * 0.1 }}s">
                            @if($enrollment->course->image)
                                <div class="relative h-48 overflow-hidden">
                                    <img src="{{ $enrollment->course->image }}" alt="{{ $enrollment->course->title }}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                                </div>
                            @else
                                <div class="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <i class="fas fa-code text-white text-5xl"></i>
                                </div>
                            @endif
                            
                            <div class="p-5">
                                <div class="flex items-start justify-between mb-3">
                                    <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{{ $enrollment->course->title }}</h3>
                                    @if($enrollment->status === 'completed')
                                        <span class="badge badge-success ml-2 whitespace-nowrap">
                                            <i class="fas fa-check-circle mr-1"></i> Concluído
                                        </span>
                                    @endif
                                </div>
                                
                                <div class="mb-4">
                                    <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
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

                                <a href="{{ route('courses.show', $enrollment->course->slug) }}" class="btn-primary w-full text-center flex items-center justify-center gap-2">
                                    <i class="fas fa-play"></i>
                                    {{ $enrollment->status === 'completed' ? 'Revisar Curso' : 'Continuar Estudando' }}
                                </a>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="card-glass p-12 text-center animate-scale-in">
                    <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-book-open text-gray-400 text-3xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum curso matriculado</h3>
                    <p class="text-gray-600 mb-6 max-w-md mx-auto">Explore nossa biblioteca de cursos e comece sua jornada na programação hoje mesmo.</p>
                    <a href="{{ route('courses.index') }}" class="btn-primary inline-flex items-center gap-2">
                        <i class="fas fa-search"></i>
                        Explorar Cursos
                    </a>
                </div>
            @endif
        </div>

        <!-- Quick Actions -->
        <div class="card-glass p-6 md:p-8 animate-fade-in">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Acesso Rápido</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="{{ route('courses.index') }}" class="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                    <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                        <i class="fas fa-search text-blue-600 group-hover:text-white text-xl"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">Explorar</span>
                </a>
                
                <a href="{{ route('courses.my-courses') }}" class="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                    <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                        <i class="fas fa-book text-blue-600 group-hover:text-white text-xl"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">Meus Cursos</span>
                </a>
                
                <div class="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed">
                    <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                        <i class="fas fa-trophy text-gray-400 text-xl"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-500">Certificados</span>
                    <span class="text-xs text-gray-400 mt-1">Em breve</span>
                </div>
                
                <div class="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed">
                    <div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                        <i class="fas fa-users text-gray-400 text-xl"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-500">Comunidade</span>
                    <span class="text-xs text-gray-400 mt-1">Em breve</span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
