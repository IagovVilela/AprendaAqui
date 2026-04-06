@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slide-down">
            <div>
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Gerenciar Cursos
                </h1>
                <p class="text-gray-600 text-lg">Cadastre e gerencie os cursos da plataforma</p>
            </div>
            <a href="{{ route('admin.courses.create') }}" class="btn-primary inline-flex items-center gap-2 whitespace-nowrap">
                <i class="fas fa-plus"></i>
                Novo Curso
            </a>
        </div>

        @if(session('success'))
            <div class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 animate-slide-down">
                <i class="fas fa-check-circle mr-2"></i>
                {{ session('success') }}
            </div>
        @endif

        <!-- Courses Table -->
        @if($courses->count() > 0)
            <div class="card-glass overflow-hidden animate-scale-in">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gradient-to-r from-gray-50 to-blue-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Curso</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categoria</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nível</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Matrículas</th>
                                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach($courses as $index => $course)
                                <tr class="hover:bg-gray-50 transition-colors stagger-item" style="animation-delay: {{ $index * 0.05 }}s">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-semibold text-gray-900">{{ $course->title }}</div>
                                        <div class="text-sm text-gray-500">{{ Str::limit($course->description, 50) }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="badge badge-primary">
                                            {{ ucfirst($course->category) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="badge badge-gray">
                                            {{ ucfirst($course->level) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        @if($course->is_published)
                                            <span class="badge badge-success">
                                                <i class="fas fa-check-circle mr-1"></i> Publicado
                                            </span>
                                        @else
                                            <span class="badge badge-warning">
                                                <i class="fas fa-clock mr-1"></i> Rascunho
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $course->enrollments_count ?? 0 }} alunos
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex items-center gap-3">
                                            <a href="{{ route('admin.courses.edit', $course) }}" class="text-blue-600 hover:text-blue-900 transition-colors" title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="{{ route('admin.courses.show', $course) }}" class="text-green-600 hover:text-green-900 transition-colors" title="Visualizar">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <form method="POST" action="{{ route('admin.courses.destroy', $course) }}" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir este curso?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-red-600 hover:text-red-900 transition-colors" title="Excluir">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex justify-center">
                {{ $courses->links() }}
            </div>
        @else
            <div class="card-glass p-12 text-center animate-scale-in">
                <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-book text-gray-400 text-5xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Nenhum curso cadastrado</h3>
                <p class="text-gray-600 mb-6">Comece criando seu primeiro curso!</p>
                <a href="{{ route('admin.courses.create') }}" class="btn-primary inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    Criar Primeiro Curso
                </a>
            </div>
        @endif
    </div>
</div>
@endsection
