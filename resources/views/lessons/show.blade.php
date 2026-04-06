@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Sidebar com Módulos e Aulas -->
            <div class="lg:col-span-1">
                <div class="bg-gray-800 rounded-lg p-4 mb-4">
                    <a href="{{ route('courses.show', $course->slug) }}" class="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                        <i class="fas fa-arrow-left"></i>
                        Voltar ao Curso
                    </a>
                </div>
                
                <div class="bg-gray-800 rounded-lg overflow-hidden">
                    <div class="p-4 bg-gray-700">
                        <h3 class="text-white font-semibold">{{ $course->title }}</h3>
                        <div class="text-sm text-gray-400 mt-1">Progresso: {{ $enrollment->progress_percentage }}%</div>
                        <div class="w-full bg-gray-600 rounded-full h-2 mt-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $enrollment->progress_percentage }}%"></div>
                        </div>
                    </div>
                    
                    <div class="max-h-[600px] overflow-y-auto">
                        @foreach($course->modules as $module)
                            <div class="border-b border-gray-700">
                                <div class="p-3 bg-gray-750 text-gray-300 font-medium text-sm">
                                    {{ $module->title }}
                                </div>
                                <div class="divide-y divide-gray-700">
                                    @foreach($module->lessons as $l)
                                        <a href="{{ route('lessons.show', [$course, $l]) }}" 
                                           class="block p-3 hover:bg-gray-700 transition-colors {{ $l->id === $lesson->id ? 'bg-gray-700 border-l-4 border-blue-500' : '' }}">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center gap-2">
                                                    @if($l->type === 'video')
                                                        <i class="fas fa-play-circle text-blue-400 text-sm"></i>
                                                    @elseif($l->type === 'text')
                                                        <i class="fas fa-file-alt text-gray-400 text-sm"></i>
                                                    @elseif($l->type === 'quiz')
                                                        <i class="fas fa-question-circle text-yellow-400 text-sm"></i>
                                                    @else
                                                        <i class="fas fa-tasks text-green-400 text-sm"></i>
                                                    @endif
                                                    <span class="text-gray-300 text-sm {{ $l->id === $lesson->id ? 'font-semibold' : '' }}">{{ $l->title }}</span>
                                                </div>
                                                @if($l->video_duration)
                                                    <span class="text-gray-500 text-xs">{{ $l->video_duration }}</span>
                                                @endif
                                            </div>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Conteúdo Principal -->
            <div class="lg:col-span-3">
                <div class="bg-gray-800 rounded-lg overflow-hidden">
                    <!-- Conteúdo da Aula -->
                    @if($lesson->type === 'video' && $lesson->video_url)
                        <!-- Player de Vídeo -->
                        <div class="bg-black aspect-video">
                            <iframe 
                                src="{{ $lesson->embed_url }}" 
                                class="w-full h-full"
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                loading="lazy">
                            </iframe>
                        </div>
                    @elseif($lesson->pdf_file)
                        <!-- Visualizador de PDF -->
                        <div class="bg-gray-900" style="height: 70vh;">
                            <iframe 
                                src="{{ route('lessons.pdf', [$course, $lesson]) }}" 
                                class="w-full h-full"
                                frameborder="0"
                                loading="lazy">
                            </iframe>
                        </div>
                    @elseif($lesson->type === 'text' && $lesson->content)
                        <!-- Conteúdo de Texto -->
                        <div class="p-6 bg-gray-900 min-h-[400px]">
                            <div class="prose prose-invert max-w-none text-gray-300">
                                {!! $lesson->content !!}
                            </div>
                        </div>
                    @else
                        <!-- Placeholder quando não há conteúdo específico -->
                        <div class="bg-gray-900 min-h-[400px] flex items-center justify-center">
                            <div class="text-center text-gray-400">
                                @if($lesson->type === 'quiz')
                                    <i class="fas fa-question-circle text-6xl mb-4"></i>
                                    <p>Quiz/Exercício</p>
                                @elseif($lesson->type === 'assignment')
                                    <i class="fas fa-tasks text-6xl mb-4"></i>
                                    <p>Atividade Prática</p>
                                @else
                                    <i class="fas fa-file-alt text-6xl mb-4"></i>
                                    <p>Material de Aula</p>
                                @endif
                            </div>
                        </div>
                    @endif

                    <!-- Informações da Aula -->
                    <div class="p-6">
                        @if($lesson->pdf_file)
                            <div class="mb-4 pb-4 border-b border-gray-700">
                                <a href="{{ route('lessons.pdf', [$course, $lesson]) }}" 
                                   target="_blank" 
                                   class="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                                    <i class="fas fa-download"></i>
                                    Baixar PDF
                                </a>
                            </div>
                        @endif
                        <div class="flex items-center justify-between mb-4">
                            <h1 class="text-2xl font-bold text-white">{{ $lesson->title }}</h1>
                            @if($progress->is_completed)
                                <span class="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                                    <i class="fas fa-check-circle mr-1"></i> Concluída
                                </span>
                            @endif
                        </div>

                        @if($lesson->description)
                            <p class="text-gray-300 mb-6">{{ $lesson->description }}</p>
                        @endif

                        @if($lesson->type !== 'video' && $lesson->type !== 'text' && $lesson->content)
                            <div class="prose prose-invert max-w-none mb-6 text-gray-300">
                                {!! $lesson->content !!}
                            </div>
                        @endif

                        <!-- Materiais Complementares -->
                        @if($lesson->materials && count($lesson->materials) > 0)
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold text-white mb-3">
                                    <i class="fas fa-book mr-2"></i> Materiais Complementares
                                </h3>
                                <div class="space-y-2">
                                    @foreach($lesson->materials as $material)
                                        @if(!empty($material['title']) || !empty($material['url']))
                                            <a href="{{ $material['url'] ?? '#' }}" 
                                               target="_blank" 
                                               class="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                                <div class="flex items-center gap-3">
                                                    <i class="fas fa-external-link-alt text-blue-400"></i>
                                                    <div>
                                                        <div class="text-white font-medium">{{ $material['title'] ?? 'Link' }}</div>
                                                        @if($material['url'])
                                                            <div class="text-sm text-gray-400">{{ $material['url'] }}</div>
                                                        @endif
                                                    </div>
                                                </div>
                                            </a>
                                        @endif
                                    @endforeach
                                </div>
                            </div>
                        @endif

                        <!-- Anexos -->
                        @if($lesson->attachments && count($lesson->attachments) > 0)
                            <div class="mb-6">
                                <h3 class="text-lg font-semibold text-white mb-3">
                                    <i class="fas fa-paperclip mr-2"></i> Anexos
                                </h3>
                                <div class="space-y-2">
                                    @foreach($lesson->attachments as $attachment)
                                        <a href="{{ Storage::url($attachment) }}" 
                                           target="_blank" 
                                           class="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                            <div class="flex items-center gap-3">
                                                <i class="fas fa-file-download text-blue-400"></i>
                                                <span class="text-white">{{ basename($attachment) }}</span>
                                            </div>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @endif

                        <!-- Botão de Conclusão -->
                        @if(!$progress->is_completed)
                            <form id="completeForm" method="POST" action="{{ route('lessons.complete', [$course, $lesson]) }}">
                                @csrf
                                <input type="hidden" name="time_watched" id="timeWatched" value="0">
                                <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    <i class="fas fa-check mr-2"></i>
                                    Marcar como Concluída
                                </button>
                            </form>
                        @endif
                    </div>

                    <!-- Navegação -->
                    <div class="border-t border-gray-700 p-6 flex justify-between">
                        @if($previousLesson)
                            <a href="{{ route('lessons.show', [$course, $previousLesson]) }}" class="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                                <i class="fas fa-arrow-left mr-2"></i>
                                Aula Anterior
                            </a>
                        @else
                            <div></div>
                        @endif

                        @if($nextLesson)
                            <a href="{{ route('lessons.show', [$course, $nextLesson]) }}" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Próxima Aula
                                <i class="fas fa-arrow-right ml-2"></i>
                            </a>
                        @else
                            <div class="bg-green-600 text-white px-6 py-2 rounded-lg">
                                <i class="fas fa-trophy mr-2"></i>
                                Curso Concluído!
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Rastrear tempo assistido (simplificado)
    let startTime = Date.now();
    
    setInterval(() => {
        const timeWatched = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timeWatched').value = timeWatched;
    }, 5000);
</script>
@endpush
@endsection

