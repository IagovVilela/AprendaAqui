@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern">
        <!-- Header -->
        <div class="text-center mb-12 animate-slide-down">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Nossos Cursos
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                Escolha o curso ideal para sua jornada na programação
            </p>
        </div>

        <!-- Filters -->
        <div class="card-glass p-6 mb-8 animate-scale-in">
            <form method="GET" action="{{ route('courses.index') }}" class="flex flex-wrap gap-4">
                <div class="flex-1 min-w-[200px]">
                    <input 
                        type="text" 
                        name="search" 
                        placeholder="Buscar cursos..." 
                        value="{{ request('search') }}"
                        class="input-modern"
                    >
                </div>
                <select name="category" class="input-modern min-w-[180px]">
                    <option value="">Todas as categorias</option>
                    <option value="programming" {{ request('category') == 'programming' ? 'selected' : '' }}>Programação</option>
                    <option value="design" {{ request('category') == 'design' ? 'selected' : '' }}>Design</option>
                    <option value="business" {{ request('category') == 'business' ? 'selected' : '' }}>Negócios</option>
                    <option value="data-science" {{ request('category') == 'data-science' ? 'selected' : '' }}>Ciência de Dados</option>
                    <option value="mobile" {{ request('category') == 'mobile' ? 'selected' : '' }}>Mobile</option>
                    <option value="devops" {{ request('category') == 'devops' ? 'selected' : '' }}>DevOps</option>
                </select>
                <select name="level" class="input-modern min-w-[180px]">
                    <option value="">Todos os níveis</option>
                    <option value="beginner" {{ request('level') == 'beginner' ? 'selected' : '' }}>Iniciante</option>
                    <option value="intermediate" {{ request('level') == 'intermediate' ? 'selected' : '' }}>Intermediário</option>
                    <option value="advanced" {{ request('level') == 'advanced' ? 'selected' : '' }}>Avançado</option>
                </select>
                <button type="submit" class="btn-primary whitespace-nowrap">
                    <i class="fas fa-filter mr-2"></i>
                    Filtrar
                </button>
            </form>
        </div>

        <!-- Courses Grid -->
        @if($courses->count() > 0)
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                @foreach($courses as $index => $course)
                    <div class="card-modern overflow-hidden stagger-item" style="animation-delay: {{ $index * 0.1 }}s">
                        @if($course->image)
                            <div class="relative h-48 overflow-hidden">
                                <img src="{{ $course->image }}" alt="{{ $course->title }}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                            </div>
                        @else
                            <div class="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <i class="fas fa-code text-white text-6xl"></i>
                            </div>
                        @endif
                        
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-3">
                                <span class="badge badge-primary">
                                    {{ ucfirst($course->level) }}
                                </span>
                                <span class="text-xl font-bold text-blue-600">
                                    {{ $course->formatted_price }}
                                </span>
                            </div>
                            
                            <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{{ $course->title }}</h3>
                            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ $course->short_description ?? Str::limit($course->description, 100) }}</p>
                            
                            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span><i class="fas fa-users mr-1"></i> {{ $course->enrollments_count ?? 0 }} alunos</span>
                                <span><i class="fas fa-clock mr-1"></i> {{ $course->duration_hours ?? 0 }}h</span>
                            </div>
                            
                            <a href="{{ route('courses.show', $course->slug) }}" class="btn-primary w-full text-center block">
                                Ver Curso
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex justify-center">
                {{ $courses->links() }}
            </div>
        @else
            <div class="card-glass p-12 text-center animate-scale-in">
                <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-search text-gray-400 text-5xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Nenhum curso encontrado</h3>
                <p class="text-gray-600 mb-6">Tente ajustar os filtros de busca</p>
                <a href="{{ route('courses.index') }}" class="btn-secondary inline-flex items-center gap-2">
                    <i class="fas fa-redo"></i>
                    Limpar Filtros
                </a>
            </div>
        @endif
    </div>
</div>
@endsection
