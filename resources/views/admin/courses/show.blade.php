@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="container-modern">
        <!-- Header -->
        <div class="mb-8 animate-slide-down">
            <a href="{{ route('admin.courses.index') }}" class="btn-ghost inline-flex items-center gap-2 mb-4">
                <i class="fas fa-arrow-left"></i>
                Voltar para lista de cursos
            </a>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {{ $course->title }}
                    </h1>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="badge badge-primary">{{ ucfirst($course->category) }}</span>
                        <span class="badge badge-gray">{{ ucfirst($course->level) }}</span>
                        @if($course->is_published)
                            <span class="badge badge-success">Publicado</span>
                        @else
                            <span class="badge badge-warning">Rascunho</span>
                        @endif
                    </div>
                </div>
                <a href="{{ route('admin.courses.edit', $course) }}" class="btn-primary inline-flex items-center gap-2">
                    <i class="fas fa-edit"></i>
                    Editar Curso
                </a>
            </div>
        </div>

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

        @if($errors->any())
            <div class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-down">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <strong>Erro de validação:</strong>
                <ul class="list-disc list-inside mt-2">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Course Content Management -->
        <div class="card-glass p-6 md:p-8 mb-8 animate-scale-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Estrutura do Curso</h2>
                <button onclick="openModuleModal()" class="btn-primary inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    Novo Módulo
                </button>
            </div>

            @if($course->modules->count() > 0)
                <div class="space-y-4">
                    @foreach($course->modules as $module)
                        <div class="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                            <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-4 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-folder text-blue-600 text-xl"></i>
                                    <h3 class="font-semibold text-gray-900 text-lg">{{ $module->title }}</h3>
                                    @if($module->description)
                                        <span class="text-sm text-gray-500">- {{ Str::limit($module->description, 50) }}</span>
                                    @endif
                                </div>
                                <div class="flex items-center gap-2">
                                    <button onclick="openModuleModal({{ $module->id }}, this)" 
                                            class="text-blue-600 hover:text-blue-800 transition-colors" 
                                            title="Editar"
                                            data-module-title="{{ htmlspecialchars($module->title, ENT_QUOTES) }}"
                                            data-module-description="{{ htmlspecialchars($module->description ?? '', ENT_QUOTES) }}"
                                            data-module-order="{{ $module->order }}"
                                            data-module-published="{{ $module->is_published ? '1' : '0' }}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="openLessonModal({{ $module->id }})" class="text-green-600 hover:text-green-800 transition-colors" title="Adicionar Aula" data-module-id="{{ $module->id }}">
                                        <i class="fas fa-plus-circle"></i>
                                    </button>
                                    <form method="POST" action="{{ route('admin.modules.destroy', [$course, $module]) }}" class="inline" onsubmit="return confirm('Tem certeza? Todas as aulas deste módulo serão excluídas.');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-600 hover:text-red-800 transition-colors" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div class="divide-y divide-gray-100">
                                @forelse($module->lessons as $lesson)
                                    <div class="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
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
                                            @if($lesson->pdf_file)
                                                <span class="badge badge-gray text-xs"><i class="fas fa-file-pdf mr-1"></i>PDF</span>
                                            @endif
                                            @if($lesson->attachments && count($lesson->attachments) > 0)
                                                <span class="badge badge-gray text-xs"><i class="fas fa-paperclip mr-1"></i>{{ count($lesson->attachments) }}</span>
                                            @endif
                                        </div>
                                        <div class="flex items-center gap-2">
                                            @if($lesson->video_duration)
                                                <span class="text-sm text-gray-500 mr-2">{{ $lesson->video_duration }}</span>
                                            @endif
                                            <button onclick="openLessonModal({{ $module->id }}, {{ $lesson->id }}, this)" 
                                                    class="text-blue-600 hover:text-blue-800 transition-colors" 
                                                    title="Editar"
                                                    data-lesson-title="{{ htmlspecialchars($lesson->title, ENT_QUOTES) }}"
                                                    data-lesson-description="{{ htmlspecialchars($lesson->description ?? '', ENT_QUOTES) }}"
                                                    data-lesson-type="{{ $lesson->type }}"
                                                    data-lesson-order="{{ $lesson->order }}"
                                                    data-lesson-video-url="{{ htmlspecialchars($lesson->video_url ?? '', ENT_QUOTES) }}"
                                                    data-lesson-video-duration="{{ htmlspecialchars($lesson->video_duration ?? '', ENT_QUOTES) }}"
                                                    data-lesson-content="{{ htmlspecialchars($lesson->content ?? '', ENT_QUOTES) }}"
                                                    data-lesson-is-free="{{ $lesson->is_free ? '1' : '0' }}"
                                                    data-lesson-is-published="{{ $lesson->is_published ? '1' : '0' }}"
                                                    data-lesson-materials="{{ json_encode($lesson->materials ?? []) }}">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <form method="POST" action="{{ route('admin.lessons.destroy', [$course, $module, $lesson]) }}" class="inline" onsubmit="return confirm('Tem certeza que deseja excluir esta aula?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-red-600 hover:text-red-800 transition-colors" title="Excluir">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                @empty
                                    <div class="px-5 py-4 text-gray-500 text-sm text-center">
                                        Nenhuma aula neste módulo. 
                                        <button onclick="openLessonModal({{ $module->id }})" class="text-green-600 hover:text-green-800 font-semibold mt-2 inline-flex items-center gap-1">
                                            <i class="fas fa-plus-circle"></i>
                                            Adicionar primeira aula
                                        </button>
                                    </div>
                                @endforelse
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-folder-open text-5xl mb-4"></i>
                    <p class="text-lg mb-4">Nenhum módulo cadastrado ainda</p>
                    <button onclick="openModuleModal()" class="btn-primary inline-flex items-center gap-2">
                        <i class="fas fa-plus"></i>
                        Criar Primeiro Módulo
                    </button>
                </div>
            @endif
        </div>
    </div>
</div>

<!-- Modal para Módulo -->
<div id="moduleModal" class="fixed inset-0 bg-white bg-opacity-80 hidden z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in">
        <div class="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900" id="moduleModalTitle">Novo Módulo</h3>
            <button onclick="closeModuleModal()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-lg sm:text-xl"></i>
            </button>
        </div>
        <form id="moduleForm" method="POST" class="p-4 sm:p-6 overflow-y-auto flex-1">
            @csrf
            <div id="moduleFormMethod"></div>
            
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Título do Módulo *</label>
                    <input type="text" name="title" id="moduleTitle" class="input-modern text-sm" required>
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                    <textarea name="description" id="moduleDescription" rows="2" class="input-modern text-sm"></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Ordem</label>
                    <input type="number" name="order" id="moduleOrder" class="input-modern text-sm" min="0">
                </div>
                
                <div class="flex items-center pt-2">
                    <input type="hidden" name="is_published" value="0">
                    <input type="checkbox" name="is_published" id="modulePublished" value="1" class="h-4 w-4 text-blue-600">
                    <label for="modulePublished" class="ml-2 text-sm text-gray-700">Publicar imediatamente</label>
                </div>
            </div>
            
            <div class="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
                <button type="button" onclick="closeModuleModal()" class="btn-secondary text-sm px-4 py-2">Cancelar</button>
                <button type="submit" class="btn-primary text-sm px-4 py-2">Salvar Módulo</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal para Aula -->
<div id="lessonModal" class="fixed inset-0 bg-white bg-opacity-80 hidden z-50 flex items-start justify-center p-1 sm:p-2 backdrop-blur-md overflow-y-auto">
    <div class="bg-white rounded-lg shadow-2xl max-w-xl w-full flex flex-col animate-scale-in my-2 sm:my-4">
        <div class="p-2 sm:p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900" id="lessonModalTitle">Nova Aula</h3>
            <button onclick="closeLessonModal()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <form id="lessonForm" method="POST" enctype="multipart/form-data" class="p-2 sm:p-3 overflow-y-auto max-h-[calc(100vh-120px)]" onsubmit="return validateLessonForm(event)">
            @csrf
            <div id="lessonFormMethod"></div>
            
            <div class="space-y-2">
                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-0.5">Título da Aula *</label>
                    <input type="text" name="title" id="lessonTitle" class="input-modern text-xs sm:text-sm py-1.5" required>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-0.5">Tipo de Aula *</label>
                        <select name="type" id="lessonType" class="input-modern text-xs sm:text-sm py-1.5" required onchange="toggleLessonFields()">
                            <option value="video">Videoaula</option>
                            <option value="text">Texto/Artigo</option>
                            <option value="quiz">Quiz/Exercício</option>
                            <option value="assignment">Atividade Prática</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-0.5">Ordem</label>
                        <input type="number" name="order" id="lessonOrder" class="input-modern text-xs sm:text-sm py-1.5" min="0">
                    </div>
                </div>
                
                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-0.5">Descrição</label>
                    <textarea name="description" id="lessonDescription" rows="2" class="input-modern text-xs sm:text-sm py-1.5"></textarea>
                </div>
                
                <!-- Campos específicos por tipo -->
                <div id="videoFields" class="space-y-2">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-0.5">URL do Vídeo</label>
                        <input type="url" name="video_url" id="lessonVideoUrl" class="input-modern text-xs sm:text-sm py-1.5" placeholder="https://youtube.com/watch?v=...">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-0.5">Duração (HH:MM:SS)</label>
                        <input type="text" name="video_duration" id="lessonVideoDuration" class="input-modern text-xs sm:text-sm py-1.5" placeholder="00:15:30">
                    </div>
                </div>
                
                <div id="textFields" class="hidden">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-0.5">Conteúdo (Markdown)</label>
                        <textarea name="content" id="lessonContent" rows="3" class="input-modern text-xs sm:text-sm py-1.5"></textarea>
                    </div>
                </div>
                
                <!-- PDF -->
                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-0.5">PDF da Aula (opcional)</label>
                    <input type="file" name="pdf_file" id="lessonPdfFile" accept=".pdf" class="input-modern text-xs sm:text-sm py-1">
                    <p class="text-xs text-gray-500 mt-0.5">Máx: 10MB</p>
                </div>
                
                <!-- Materiais Complementares -->
                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-0.5">Materiais Complementares</label>
                    <div id="materialsContainer" class="space-y-1.5">
                        <div class="flex flex-col sm:flex-row gap-1.5">
                            <input type="text" name="materials[0][title]" placeholder="Título" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                            <input type="url" name="materials[0][url]" placeholder="URL" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                            <button type="button" onclick="addMaterial()" class="btn-secondary text-xs px-2 py-1.5">
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Anexos -->
                <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-0.5">Anexos</label>
                    <input type="file" name="attachments[]" multiple class="input-modern text-xs sm:text-sm py-1">
                    <p class="text-xs text-gray-500 mt-0.5">Múltiplos arquivos permitidos</p>
                </div>
                
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1.5">
                    <label class="flex items-center">
                        <input type="hidden" name="is_free" value="0">
                        <input type="checkbox" name="is_free" id="lessonIsFree" value="1" class="h-3.5 w-3.5 text-blue-600">
                        <span class="ml-1.5 text-xs text-gray-700">Aula Gratuita</span>
                    </label>
                    <label class="flex items-center">
                        <input type="hidden" name="is_published" value="0">
                        <input type="checkbox" name="is_published" id="lessonPublished" value="1" class="h-3.5 w-3.5 text-blue-600">
                        <span class="ml-1.5 text-xs text-gray-700">Publicar imediatamente</span>
                    </label>
                </div>
            </div>
            
            <div class="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-200 flex-shrink-0">
                <button type="button" onclick="closeLessonModal()" class="btn-secondary text-xs px-3 py-1.5">Cancelar</button>
                <button type="submit" class="btn-primary text-xs px-3 py-1.5">Salvar Aula</button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
let materialCount = 1;

function openModuleModal(moduleId = null, buttonElement = null) {
    const modal = document.getElementById('moduleModal');
    const form = document.getElementById('moduleForm');
    const title = document.getElementById('moduleModalTitle');
    const methodDiv = document.getElementById('moduleFormMethod');
    
    if (moduleId && buttonElement) {
        // Editar módulo existente
        title.textContent = 'Editar Módulo';
        form.action = '{{ route("admin.modules.update", [$course, ":module"]) }}'.replace(':module', moduleId);
        methodDiv.innerHTML = '<input type="hidden" name="_method" value="PUT">';
        
        // Carregar dados do módulo
        document.getElementById('moduleTitle').value = buttonElement.getAttribute('data-module-title') || '';
        document.getElementById('moduleDescription').value = buttonElement.getAttribute('data-module-description') || '';
        document.getElementById('moduleOrder').value = buttonElement.getAttribute('data-module-order') || '';
        document.getElementById('modulePublished').checked = buttonElement.getAttribute('data-module-published') === '1';
    } else {
        // Novo módulo
        title.textContent = 'Novo Módulo';
        form.action = '{{ route("admin.modules.store", $course) }}';
        methodDiv.innerHTML = '';
        form.reset();
        document.getElementById('modulePublished').checked = false;
    }
    
    modal.classList.remove('hidden');
}

function closeModuleModal() {
    document.getElementById('moduleModal').classList.add('hidden');
}

function openLessonModal(moduleId, lessonId = null, buttonElement = null) {
    if (!moduleId) {
        alert('Erro: ID do módulo não encontrado. Por favor, recarregue a página.');
        return;
    }
    
    const modal = document.getElementById('lessonModal');
    const form = document.getElementById('lessonForm');
    const title = document.getElementById('lessonModalTitle');
    const methodDiv = document.getElementById('lessonFormMethod');
    
    if (lessonId && buttonElement) {
        // Editar aula existente
        title.textContent = 'Editar Aula';
        form.action = '{{ route("admin.lessons.update", [$course, ":module", ":lesson"]) }}'.replace(':module', moduleId).replace(':lesson', lessonId);
        methodDiv.innerHTML = '<input type="hidden" name="_method" value="PUT">';
        
        // Carregar dados da aula
        if (buttonElement) {
            document.getElementById('lessonTitle').value = buttonElement.getAttribute('data-lesson-title') || '';
            document.getElementById('lessonDescription').value = buttonElement.getAttribute('data-lesson-description') || '';
            document.getElementById('lessonType').value = buttonElement.getAttribute('data-lesson-type') || 'video';
            document.getElementById('lessonOrder').value = buttonElement.getAttribute('data-lesson-order') || '';
            document.getElementById('lessonVideoUrl').value = buttonElement.getAttribute('data-lesson-video-url') || '';
            document.getElementById('lessonVideoDuration').value = buttonElement.getAttribute('data-lesson-video-duration') || '';
            document.getElementById('lessonContent').value = buttonElement.getAttribute('data-lesson-content') || '';
            document.getElementById('lessonIsFree').checked = buttonElement.getAttribute('data-lesson-is-free') === '1';
            document.getElementById('lessonPublished').checked = buttonElement.getAttribute('data-lesson-is-published') === '1';
            
            // Carregar materiais
            try {
                const materials = JSON.parse(buttonElement.getAttribute('data-lesson-materials') || '[]');
                const container = document.getElementById('materialsContainer');
                container.innerHTML = '';
                materialCount = 0;
                
                if (materials && materials.length > 0) {
                    materials.forEach((material, index) => {
                        if (material.title || material.url) {
                            const div = document.createElement('div');
                            div.className = 'flex flex-col sm:flex-row gap-1.5';
                            div.innerHTML = `
                                <input type="text" name="materials[${materialCount}][title]" placeholder="Título" value="${material.title || ''}" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                                <input type="url" name="materials[${materialCount}][url]" placeholder="URL" value="${material.url || ''}" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                                <button type="button" onclick="this.parentElement.remove()" class="btn-secondary text-xs px-2 py-1.5">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            `;
                            container.appendChild(div);
                            materialCount++;
                        }
                    });
                }
                
                // Adicionar campo vazio se não houver materiais
                if (materialCount === 0) {
                    const div = document.createElement('div');
                    div.className = 'flex flex-col sm:flex-row gap-1.5';
                    div.innerHTML = `
                        <input type="text" name="materials[0][title]" placeholder="Título" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                        <input type="url" name="materials[0][url]" placeholder="URL" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                        <button type="button" onclick="addMaterial()" class="btn-secondary text-xs px-2 py-1.5">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    `;
                    container.appendChild(div);
                    materialCount = 1;
                }
            } catch (e) {
                console.error('Erro ao carregar materiais:', e);
            }
            
            toggleLessonFields();
        }
    } else {
        // Nova aula
        title.textContent = 'Nova Aula';
        form.action = '{{ route("admin.lessons.store", [$course, ":module"]) }}'.replace(':module', moduleId);
        methodDiv.innerHTML = '';
        form.reset();
        document.getElementById('lessonIsFree').checked = false;
        document.getElementById('lessonPublished').checked = false;
        
        // Limpar materiais
        const container = document.getElementById('materialsContainer');
        container.innerHTML = `
            <div class="flex flex-col sm:flex-row gap-1.5">
                <input type="text" name="materials[0][title]" placeholder="Título" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                <input type="url" name="materials[0][url]" placeholder="URL" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
                <button type="button" onclick="addMaterial()" class="btn-secondary text-xs px-2 py-1.5">
                    <i class="fas fa-plus text-xs"></i>
                </button>
            </div>
        `;
        materialCount = 1;
        
        toggleLessonFields();
    }
    
    modal.classList.remove('hidden');
    // Scroll para o topo do modal
    modal.scrollTop = 0;
    form.scrollTop = 0;
    // Prevenir scroll do body quando modal estiver aberto
    document.body.style.overflow = 'hidden';
}

function closeLessonModal() {
    document.getElementById('lessonModal').classList.add('hidden');
    // Restaurar scroll do body
    document.body.style.overflow = '';
}

function toggleLessonFields() {
    const type = document.getElementById('lessonType').value;
    const videoFields = document.getElementById('videoFields');
    const textFields = document.getElementById('textFields');
    
    if (type === 'video') {
        videoFields.classList.remove('hidden');
        textFields.classList.add('hidden');
    } else if (type === 'text') {
        videoFields.classList.add('hidden');
        textFields.classList.remove('hidden');
    } else {
        videoFields.classList.add('hidden');
        textFields.classList.add('hidden');
    }
}

function addMaterial() {
    const container = document.getElementById('materialsContainer');
    const div = document.createElement('div');
    div.className = 'flex flex-col sm:flex-row gap-1.5';
    div.innerHTML = `
        <input type="text" name="materials[${materialCount}][title]" placeholder="Título" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
        <input type="url" name="materials[${materialCount}][url]" placeholder="URL" class="input-modern text-xs sm:text-sm py-1.5 flex-1">
        <button type="button" onclick="this.parentElement.remove()" class="btn-secondary text-xs px-2 py-1.5">
            <i class="fas fa-times text-xs"></i>
        </button>
    `;
    container.appendChild(div);
    materialCount++;
}

// Validação do formulário de aula
function validateLessonForm(event) {
    const form = event.target;
    const title = document.getElementById('lessonTitle').value.trim();
    const type = document.getElementById('lessonType').value;
    const videoUrl = document.getElementById('lessonVideoUrl').value.trim();
    
    if (!title) {
        alert('Por favor, preencha o título da aula.');
        event.preventDefault();
        return false;
    }
    
    if (type === 'video' && !videoUrl) {
        const confirm = window.confirm('Você selecionou "Videoaula" mas não preencheu a URL do vídeo. Deseja continuar mesmo assim?');
        if (!confirm) {
            event.preventDefault();
            return false;
        }
    }
    
    return true;
}

// Fechar modais ao clicar fora
document.getElementById('moduleModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModuleModal();
});

document.getElementById('lessonModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeLessonModal();
});

// Adicionar indicador de loading no submit
document.getElementById('lessonForm')?.addEventListener('submit', function() {
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
    }
});
</script>
@endpush
@endsection
