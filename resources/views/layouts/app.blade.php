<!DOCTYPE html>
<html class="scroll-smooth h-full" lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

    <title>{{ config('app.name', 'Aprenda Aqui') }}</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Tailwind CSS -->
    @vite('resources/css/app.css')

    <!-- Livewire Styles -->
    @livewireStyles

    <!-- Stack para estilos adicionais -->
    @stack('styles')
</head>

<body class="h-full flex flex-col font-inter text-text-dark leading-relaxed bg-white">
    <!-- Header -->
    @include('layouts.header')

    <!-- Main Content -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer -->
    @include('layouts.footer')

    <!-- Scripts do Laravel Vite -->
    @vite('resources/js/app.js') <!-- Adiciona o arquivo JS principal -->

    {{-- @include('components.notification') --}}

    <!-- Livewire Scripts -->
    @livewireScripts

    <!-- Stack para scripts adicionais -->
    @stack('scripts')
</body>

</html>