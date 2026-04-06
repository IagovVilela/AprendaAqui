<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <!-- Header -->
        <div class="text-center animate-slide-down">
            <div class="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
                <i class="fas fa-user-plus text-3xl text-white"></i>
            </div>
            <h2 class="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Criar Conta
            </h2>
            <p class="text-gray-600 text-lg">Comece sua jornada na programação hoje</p>
        </div>

        <!-- Flash Messages -->
        @if (session()->has('success'))
            <div class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-center animate-slide-down shadow-md">
                <i class="fas fa-check-circle mr-3 text-green-500"></i>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        @if (session()->has('error'))
            <div class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center animate-slide-down shadow-md">
                <i class="fas fa-exclamation-circle mr-3 text-red-500"></i>
                <span>{{ session('error') }}</span>
            </div>
        @endif

        <!-- Card -->
        <div class="card-glass py-8 px-6 sm:px-8 animate-scale-in">
            <form wire:submit.prevent="register" class="space-y-5">
                <!-- Name -->
                <div class="space-y-2">
                    <label for="name" class="block text-sm font-semibold text-gray-700">
                        <i class="fas fa-user text-blue-600 mr-2"></i>
                        Nome Completo
                    </label>
                    <input 
                        wire:model="name" 
                        type="text" 
                        id="name"
                        class="input-modern @error('name') border-red-500 focus:ring-red-500 @enderror"
                        placeholder="Seu nome completo"
                        required
                        autocomplete="name"
                    >
                    @error('name')
                        <p class="text-sm text-red-600 flex items-center mt-1 animate-slide-down">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Email -->
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-semibold text-gray-700">
                        <i class="fas fa-envelope text-blue-600 mr-2"></i>
                        Email
                    </label>
                    <input 
                        wire:model="email" 
                        type="email" 
                        id="email"
                        class="input-modern @error('email') border-red-500 focus:ring-red-500 @enderror"
                        placeholder="seu@email.com"
                        required
                        autocomplete="email"
                    >
                    @error('email')
                        <p class="text-sm text-red-600 flex items-center mt-1 animate-slide-down">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Password -->
                <div class="space-y-2">
                    <label for="password" class="block text-sm font-semibold text-gray-700">
                        <i class="fas fa-lock text-blue-600 mr-2"></i>
                        Senha
                    </label>
                    <input 
                        wire:model="password" 
                        type="password" 
                        id="password"
                        class="input-modern @error('password') border-red-500 focus:ring-red-500 @enderror"
                        placeholder="Mínimo 6 caracteres"
                        required
                        autocomplete="new-password"
                    >
                    @error('password')
                        <p class="text-sm text-red-600 flex items-center mt-1 animate-slide-down">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            {{ $message }}
                        </p>
                    @enderror
                </div>

                <!-- Password Confirmation -->
                <div class="space-y-2">
                    <label for="password_confirmation" class="block text-sm font-semibold text-gray-700">
                        <i class="fas fa-lock text-blue-600 mr-2"></i>
                        Confirmar Senha
                    </label>
                    <input 
                        wire:model="password_confirmation" 
                        type="password" 
                        id="password_confirmation"
                        class="input-modern"
                        placeholder="Digite a senha novamente"
                        required
                        autocomplete="new-password"
                    >
                </div>

                <!-- Role -->
                <div class="space-y-2">
                    <label for="role" class="block text-sm font-semibold text-gray-700">
                        <i class="fas fa-user-shield text-blue-600 mr-2"></i>
                        Tipo de Conta
                    </label>
                    <select 
                        wire:model="role" 
                        id="role"
                        class="input-modern"
                        required
                    >
                        <option value="user">Usuário Comum</option>
                        <option value="admin">Administrador</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1 flex items-start gap-1">
                        <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
                        <span>Administradores podem cadastrar e gerenciar cursos</span>
                    </p>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit"
                    class="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                    wire:loading.attr="disabled"
                >
                    <div wire:loading wire:target="register" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <i wire:loading.remove wire:target="register" class="fas fa-user-plus"></i>
                    <span wire:loading.remove wire:target="register">Criar Conta</span>
                    <span wire:loading wire:target="register">Criando...</span>
                </button>
            </form>

            <!-- Login Link -->
            <div class="mt-8 pt-6 border-t border-gray-200 text-center">
                <p class="text-gray-600">
                    Já tem uma conta? 
                    <a href="{{ route('login') }}" class="text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline inline-flex items-center gap-1">
                        Fazer login
                        <i class="fas fa-arrow-right text-sm"></i>
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>

@push('styles')
<style>
    @keyframes blob {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -50px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
    }
    
    .animate-blob {
        animation: blob 7s infinite;
    }
    
    .animation-delay-2000 {
        animation-delay: 2s;
    }
    
    .animation-delay-4000 {
        animation-delay: 4s;
    }
</style>
@endpush
