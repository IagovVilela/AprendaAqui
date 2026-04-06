<header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
                <a href="{{ route('home') }}" class="flex items-center gap-2 text-2xl font-bold text-blue-600">
                    <i class="fas fa-code"></i>
                    <span>Aprenda Aqui</span>
                </a>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-6">
                <a href="{{ route('home') }}" class="text-gray-700 hover:text-blue-600 transition-colors">Início</a>
                <a href="{{ route('courses.index') }}" class="text-gray-700 hover:text-blue-600 transition-colors">Cursos</a>
                
                @auth
                    <a href="{{ route('dashboard') }}" class="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
                    <a href="{{ route('courses.my-courses') }}" class="text-gray-700 hover:text-blue-600 transition-colors">Meus Cursos</a>
                    @if(Auth::user()->isAdmin())
                        <a href="{{ route('admin.courses.index') }}" class="text-gray-700 hover:text-blue-600 transition-colors font-semibold">
                            <i class="fas fa-cog mr-1"></i>Admin
                        </a>
                    @endif
                @endauth
            </div>

            <!-- Auth Buttons -->
            <div class="flex items-center gap-4">
                @auth
                    <span class="text-gray-700 hidden md:block">{{ Auth::user()->name }}</span>
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            Sair
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="text-gray-700 hover:text-blue-600 transition-colors">Entrar</a>
                    <a href="{{ route('register') }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Criar Conta
                    </a>
                @endauth
            </div>
        </div>
    </nav>
</header>

