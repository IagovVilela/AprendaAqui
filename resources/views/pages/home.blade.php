<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Programe Aqui - Transforme sua Carreira com Programação</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary-blue': '#1e40af',
                        'secondary-blue': '#3b82f6',
                        'light-blue': '#60a5fa',
                        'accent-blue': '#1d4ed8',
                        'dark-blue': '#1e3a8a',
                        'text-dark': '#1f2937',
                        'text-light': '#6b7280',
                        'surface': '#f8fafc',
                        'border': '#e5e7eb'
                    },
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif']
                    },
                    animation: {
                        'float-particle': 'float-particle linear infinite',
                        'code-pulse': 'code-pulse 2s ease-in-out infinite',
                        'underline-expand': 'underline-expand 2s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards',
                        'bounce': 'bounce 2s ease-in-out infinite',
                        'geometric-float': 'geometric-float 20s ease-in-out infinite',
                        'slideInLeft': 'slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
                        'slideInRight': 'slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) 0.7s forwards',
                        'fadeInUp': 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        'code-appear': 'code-appear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                        'cursor-blink': 'cursor-blink 1s infinite',
                        'pulse': 'pulse 2s ease-in-out infinite',
                        'tech-float': 'tech-float 3s ease-in-out infinite',
                        'testimonial-float': 'testimonial-float 4s ease-in-out infinite',
                        'stats-bg': 'stats-bg 15s ease-in-out infinite'
                    },
                    keyframes: {
                        'float-particle': {
                            '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
                            '10%': { opacity: '0.6' },
                            '90%': { opacity: '0.6' },
                            '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' }
                        },
                        'code-pulse': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.1)' }
                        },
                        'underline-expand': {
                            'to': { transform: 'scaleX(1)' }
                        },
                        'bounce': {
                            '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                            '40%': { transform: 'translateY(-5px)' },
                            '60%': { transform: 'translateY(-3px)' }
                        },
                        'geometric-float': {
                            '0%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
                            '33%': { transform: 'translateX(-20px) translateY(-30px) rotate(120deg)' },
                            '66%': { transform: 'translateX(20px) translateY(-20px) rotate(240deg)' }
                        },
                        'slideInLeft': {
                            'from': { opacity: '0', transform: 'translateX(-50px)' },
                            'to': { opacity: '1', transform: 'translateX(0)' }
                        },
                        'slideInRight': {
                            'from': { opacity: '0', transform: 'translateX(50px)' },
                            'to': { opacity: '1', transform: 'translateX(0)' }
                        },
                        'fadeInUp': {
                            'from': { opacity: '0', transform: 'translateY(30px)' },
                            'to': { opacity: '1', transform: 'translateY(0)' }
                        },
                        'code-appear': {
                            'to': { opacity: '1', transform: 'translateX(0)' }
                        },
                        'cursor-blink': {
                            '0%, 50%': { opacity: '1' },
                            '51%, 100%': { opacity: '0' }
                        },
                        'pulse': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' }
                        },
                        'tech-float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-5px)' }
                        },
                        'testimonial-float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-3px)' }
                        },
                        'stats-bg': {
                            '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                            '50%': { transform: 'scale(1.1) rotate(5deg)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        /* Custom styles for complex animations and effects */
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #60a5fa;
            border-radius: 50%;
            opacity: 0.6;
            animation: float-particle linear infinite;
        }

        .hero-badge::before {
            content: '🚀';
            animation: bounce 2s ease-in-out infinite;
        }

        .hero-text h1 .highlight::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: #60a5fa;
            animation: underline-expand 2s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards;
            transform: scaleX(0);
            transform-origin: left;
        }

        .primary-btn::after {
            content: '→';
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .secondary-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: #1e40af;
            transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: -1;
        }

        .secondary-btn:hover::before {
            left: 0;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 4px;
            background: #1e40af;
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover::before {
            left: 0;
        }

        .tech-category::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 4px;
            background: #1e40af;
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tech-category:hover::before {
            left: 0;
        }

        .testimonial-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 4px;
            background: #1e40af;
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card:hover::before {
            left: 0;
        }

        .testimonial-content p::before {
            content: '"';
            font-size: 3rem;
            color: #60a5fa;
            position: absolute;
            top: -1rem;
            left: -0.5rem;
            font-family: serif;
            opacity: 0.3;
        }

        .stats::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%);
            animation: stats-bg 15s ease-in-out infinite;
        }

        .code-line:nth-child(1) { animation-delay: 1.2s; }
        .code-line:nth-child(2) { animation-delay: 1.4s; }
        .code-line:nth-child(3) { animation-delay: 1.6s; }
        .code-line:nth-child(4) { animation-delay: 1.8s; }
        .code-line:nth-child(5) { animation-delay: 2.0s; }
        .code-line:nth-child(6) { animation-delay: 2.2s; }

        .feature-card:nth-child(1) { animation-delay: 0.2s; }
        .feature-card:nth-child(2) { animation-delay: 0.4s; }
        .feature-card:nth-child(3) { animation-delay: 0.6s; }

        .stat-item:nth-child(1) { animation-delay: 0.2s; }
        .stat-item:nth-child(2) { animation-delay: 0.4s; }
        .stat-item:nth-child(3) { animation-delay: 0.6s; }
        .stat-item:nth-child(4) { animation-delay: 0.8s; }

        .tech-item:nth-child(odd) {
            animation-delay: 0.5s;
        }

        .tech-item:nth-child(even) {
            animation-delay: 1s;
        }

        .testimonial-card:nth-child(2) {
            animation-delay: 1s;
        }

        .testimonial-card:nth-child(3) {
            animation-delay: 2s;
        }

        .hero-badge i {
            animation: bounce 2s ease-in-out infinite;
        }

        .section-badge i {
            animation: pulse 2s ease-in-out infinite;
        }

        .tech-item {
            animation: tech-float 3s ease-in-out infinite;
        }

        .testimonial-card {
            animation: testimonial-float 4s ease-in-out infinite;
        }

        .reveal {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body class="font-inter text-text-dark leading-relaxed overflow-x-hidden bg-white">
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-10" id="particles"></div>

    <header id="header" class="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-border transition-all duration-500 ease-out">
        <div class="max-w-6xl mx-auto px-6">
            <nav class="flex justify-between items-center py-6">
                <a href="#" class="text-3xl font-bold text-primary-blue no-underline relative flex items-center gap-2 group">
                    <i class="fas fa-code text-2xl animate-code-pulse"></i>
                    Aprenda Aqui
                    <div class="absolute bottom-0 left-0 w-0 h-1 bg-accent-blue transition-all duration-500 ease-out group-hover:w-full"></div>
                </a>
                <ul class="hidden md:flex list-none gap-10">
                    <li><a href="#home" class="no-underline text-text-dark font-medium text-base relative transition-all duration-300 ease-out hover:text-primary-blue hover:-translate-y-0.5 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-secondary-blue before:transform before:-translate-x-1/2 before:transition-all before:duration-300 before:ease-out hover:before:w-full">Início</a></li>
                    <li><a href="#cursos" class="no-underline text-text-dark font-medium text-base relative transition-all duration-300 ease-out hover:text-primary-blue hover:-translate-y-0.5 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-secondary-blue before:transform before:-translate-x-1/2 before:transition-all before:duration-300 before:ease-out hover:before:w-full">Cursos</a></li>
                    <li><a href="#sobre" class="no-underline text-text-dark font-medium text-base relative transition-all duration-300 ease-out hover:text-primary-blue hover:-translate-y-0.5 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-secondary-blue before:transform before:-translate-x-1/2 before:transition-all before:duration-300 before:ease-out hover:before:w-full">Sobre</a></li>
                    <li><a href="#contato" class="no-underline text-text-dark font-medium text-base relative transition-all duration-300 ease-out hover:text-primary-blue hover:-translate-y-0.5 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-secondary-blue before:transform before:-translate-x-1/2 before:transition-all before:duration-300 before:ease-out hover:before:w-full">Contato</a></li>
                </ul>
                <a href="{{ route('login') }}" class="bg-primary-blue text-white px-8 py-3.5 border-0 rounded-lg font-semibold text-base cursor-pointer transition-all duration-300 ease-out no-underline inline-flex items-center gap-2 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary-blue/30 before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-accent-blue before:transition-all before:duration-500 before:ease-out before:-z-10 hover:before:left-0">Começar Agora</a>
            </nav>
        </div>
    </header>

    <main>
        <section class="min-h-screen flex items-center relative bg-gradient-to-br from-surface to-slate-200 z-20" id="home">
            <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-br from-primary-blue/20 via-secondary-blue/20 to-light-blue/20 animate-geometric-float"></div>
            <div class="max-w-6xl mx-auto px-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-20 z-30 relative">
                    <div class="opacity-0 -translate-x-12 animate-slideInLeft">
                        <div class="hero-badge inline-flex items-center gap-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-primary-blue/20">
                            <i class="fas fa-rocket"></i>
                            Líder em Educação Tech
                        </div>
                        <h1 class="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 text-text-dark relative">
                            Domine a <span class="text-primary-blue relative">Programação</span><br>
                            e Transforme sua Carreira
                        </h1>
                        <p class="text-xl text-text-light mb-10 leading-relaxed max-w-lg">
                            Desenvolva habilidades de alta demanda com nossa metodologia comprovada. 
                            Projetos reais, mentoria especializada e garantia de empregabilidade.
                        </p>
                        <div class="flex gap-6 flex-wrap">
                            <a href="{{ route('login') }}" class="primary-btn bg-primary-blue text-white px-10 py-4 border-0 rounded-lg font-semibold text-lg cursor-pointer transition-all duration-300 ease-out no-underline inline-flex items-center gap-3 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-blue/30 after:content-['→'] after:transition-transform after:duration-300 after:ease-out hover:after:translate-x-1">
                                <i class="fas fa-play"></i>
                                Iniciar Jornada
                            </a>
                            <a href="#" class="secondary-btn bg-transparent text-primary-blue border-2 border-primary-blue px-10 py-4 rounded-lg font-semibold text-lg cursor-pointer transition-all duration-300 ease-out no-underline inline-flex items-center gap-3 relative overflow-hidden hover:text-white hover:-translate-y-1 before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-primary-blue before:transition-all before:duration-500 before:ease-out before:-z-10 hover:before:left-0">
                                <i class="fas fa-play-circle"></i>
                                Ver Demo
                            </a>
                        </div>
                    </div>
                    <div class="flex justify-center items-center relative opacity-0 translate-x-12 animate-slideInRight">
                        <div class="bg-slate-900 rounded-2xl p-6 shadow-2xl shadow-slate-900/30 max-w-lg w-full relative transform perspective-1000 -rotate-y-2 rotate-x-1 transition-transform duration-700 ease-out hover:rotate-y-0 hover:rotate-x-0 hover:translate-z-5">
                            <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                <div class="flex gap-2">
                                    <div class="w-3.5 h-3.5 rounded-full cursor-pointer transition-transform hover:scale-110 bg-red-500"></div>
                                    <div class="w-3.5 h-3.5 rounded-full cursor-pointer transition-transform hover:scale-110 bg-yellow-500"></div>
                                    <div class="w-3.5 h-3.5 rounded-full cursor-pointer transition-transform hover:scale-110 bg-green-500"></div>
                                </div>
                                <div class="text-slate-400 text-sm font-medium">app.js</div>
                            </div>
                            <div class="flex text-slate-200 font-mono text-sm leading-loose">
                                <div class="text-slate-500 font-mono text-sm leading-loose text-right pr-4 border-r border-white/10 mr-4 select-none">
                                    <div>1</div>
                                    <div>2</div>
                                    <div>3</div>
                                    <div>4</div>
                                    <div>5</div>
                                    <div>6</div>
                                </div>
                                <div class="code-lines">
                                    <div class="code-line opacity-0 -translate-x-5 animate-code-appear"><span class="text-light-blue">const</span> <span class="text-emerald-400">createDeveloper</span> = () => {</div>
                                    <div class="code-line opacity-0 -translate-x-5 animate-code-appear">  <span class="text-light-blue">return</span> <span class="text-yellow-400">'Success Guaranteed!'</span>;</div>
                                    <div class="code-line opacity-0 -translate-x-5 animate-code-appear">};</div>
                                    <div class="code-line opacity-0 -translate-x-5 animate-code-appear"></div>
                                    <div class="code-line opacity-0 -translate-x-5 animate-code-appear"><span class="text-emerald-400">createDeveloper</span>();<span class="inline-block w-0.5 h-5 bg-light-blue animate-cursor-blink"></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-32 bg-white relative reveal">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-20 opacity-0 translate-y-8 animate-fadeInUp">
                    <div class="section-badge inline-flex items-center gap-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-blue/20">
                        <i class="fas fa-bolt"></i>
                        Por que somos únicos
                    </div>
                    <h2 class="text-4xl lg:text-6xl font-extrabold mb-6 text-text-dark">Metodologia que Garante Resultados</h2>
                    <p class="text-xl text-text-light max-w-3xl mx-auto leading-relaxed">Nossa abordagem diferenciada combina teoria avançada com prática intensiva, 
                    preparando você para os desafios reais do mercado de tecnologia.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div class="feature-card bg-white p-12 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden opacity-0 translate-y-12 animate-fadeInUp group">
                        <div class="w-20 h-20 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-8 text-3xl transition-all duration-300 ease-out border border-primary-blue/20 text-primary-blue group-hover:bg-primary-blue group-hover:scale-110 group-hover:text-white">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 text-text-dark">Projetos Enterprise</h3>
                        <p class="text-text-light leading-relaxed text-lg">Desenvolva aplicações completas utilizando as mesmas tecnologias e padrões 
                        das maiores empresas tech do mundo. Portfolio profissional garantido.</p>
                    </div>
                    <div class="feature-card bg-white p-12 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden opacity-0 translate-y-12 animate-fadeInUp group">
                        <div class="w-20 h-20 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-8 text-3xl transition-all duration-300 ease-out border border-primary-blue/20 text-primary-blue group-hover:bg-primary-blue group-hover:scale-110 group-hover:text-white">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 text-text-dark">Mentoria Senior</h3>
                        <p class="text-text-light leading-relaxed text-lg">Acompanhamento individual com desenvolvedores seniores de empresas como Google, 
                        Microsoft e startups unicórnios. Feedback personalizado e direcionamento de carreira.</p>
                    </div>
                    <div class="feature-card bg-white p-12 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden opacity-0 translate-y-12 animate-fadeInUp group">
                        <div class="w-20 h-20 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-8 text-3xl transition-all duration-300 ease-out border border-primary-blue/20 text-primary-blue group-hover:bg-primary-blue group-hover:scale-110 group-hover:text-white">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 text-text-dark">Garantia de Colocação</h3>
                        <p class="text-text-light leading-relaxed text-lg">Programa exclusivo de colocação no mercado com parcerias em +200 empresas. 
                        Preparação completa para entrevistas técnicas e comportamentais.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Technologies Section -->
        <section class="py-32 bg-surface relative reveal">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-20 opacity-0 translate-y-8 animate-fadeInUp">
                    <div class="section-badge inline-flex items-center gap-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-blue/20">
                        <i class="fas fa-cogs"></i>
                        Tecnologias que você vai dominar
                    </div>
                    <h2 class="text-4xl lg:text-6xl font-extrabold mb-6 text-text-dark">Stack Completa para o Mercado</h2>
                    <p class="text-xl text-text-light max-w-3xl mx-auto leading-relaxed">Domine as tecnologias mais demandadas pelas empresas e construa projetos incríveis</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
                    <div class="tech-category bg-white p-10 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden group">
                        <h3 class="text-2xl font-bold mb-8 text-text-dark flex items-center gap-3">
                            <i class="fas fa-laptop-code text-primary-blue text-xl"></i>
                            Frontend
                        </h3>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-html5 text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">HTML5</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-css3-alt text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">CSS3</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-js-square text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">JavaScript</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-react text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">React</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-vue text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Vue.js</span>
                            </div>
                        </div>
                    </div>
                    <div class="tech-category bg-white p-10 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden group">
                        <h3 class="text-2xl font-bold mb-8 text-text-dark flex items-center gap-3">
                            <i class="fas fa-server text-primary-blue text-xl"></i>
                            Backend
                        </h3>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-node-js text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Node.js</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-python text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Python</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fas fa-database text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">MongoDB</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fas fa-database text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">PostgreSQL</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-aws text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">AWS</span>
                            </div>
                        </div>
                    </div>
                    <div class="tech-category bg-white p-10 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden group">
                        <h3 class="text-2xl font-bold mb-8 text-text-dark flex items-center gap-3">
                            <i class="fas fa-mobile-alt text-primary-blue text-xl"></i>
                            Mobile & DevOps
                        </h3>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-android text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">React Native</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-docker text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Docker</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-git-alt text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Git</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fab fa-linux text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Linux</span>
                            </div>
                            <div class="tech-item flex flex-col items-center gap-3 p-6 bg-primary-blue/5 rounded-xl border border-primary-blue/10 transition-all duration-300 ease-out cursor-pointer group-hover:bg-primary-blue group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary-blue/20">
                                <i class="fas fa-cloud text-3xl text-primary-blue transition-all duration-300 ease-out group-hover:text-white"></i>
                                <span class="text-sm font-semibold text-text-dark text-center transition-all duration-300 ease-out group-hover:text-white">Cloud</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-primary-blue text-white relative overflow-hidden reveal">
            <div class="stats-content relative z-20">
                <div class="max-w-6xl mx-auto px-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div class="stat-item opacity-0 translate-y-8 animate-fadeInUp">
                            <h3 class="text-6xl font-extrabold mb-2 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent counter" data-target="8500">0</h3>
                            <p class="text-xl opacity-90 font-medium">Desenvolvedores Formados</p>
                        </div>
                        <div class="stat-item opacity-0 translate-y-8 animate-fadeInUp">
                            <h3 class="text-6xl font-extrabold mb-2 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent counter" data-target="96">0</h3>
                            <p class="text-xl opacity-90 font-medium">% Taxa de Empregabilidade</p>
                        </div>
                        <div class="stat-item opacity-0 translate-y-8 animate-fadeInUp">
                            <h3 class="text-6xl font-extrabold mb-2 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">R$ 8.5k</h3>
                            <p class="text-xl opacity-90 font-medium">Salário Médio Inicial</p>
                        </div>
                        <div class="stat-item opacity-0 translate-y-8 animate-fadeInUp">
                            <h3 class="text-6xl font-extrabold mb-2 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent counter" data-target="200">0</h3>
                            <p class="text-xl opacity-90 font-medium">Empresas Parceiras</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-32 bg-white relative reveal">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-20 opacity-0 translate-y-8 animate-fadeInUp">
                    <div class="section-badge inline-flex items-center gap-2 bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary-blue/20">
                        <i class="fas fa-quote-left"></i>
                        Depoimentos
                    </div>
                    <h2 class="text-4xl lg:text-6xl font-extrabold mb-6 text-text-dark">O que nossos alunos dizem</h2>
                    <p class="text-xl text-text-light max-w-3xl mx-auto leading-relaxed">Histórias reais de transformação e sucesso profissional</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
                    <div class="testimonial-card bg-white p-10 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden group">
                        <div class="testimonial-content mb-8">
                            <div class="flex gap-1 mb-6">
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                            </div>
                            <p class="text-lg leading-relaxed text-text-dark italic relative">"Em 6 meses consegui minha primeira vaga como desenvolvedor. A metodologia é incrível e os mentores são excepcionais!"</p>
                        </div>
                        <div class="testimonial-author flex items-center gap-4">
                            <div class="w-15 h-15 bg-primary-blue rounded-full flex items-center justify-center text-white text-2xl">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="author-info">
                                <h4 class="text-lg font-bold text-text-dark mb-1">Maria Silva</h4>
                                <span class="text-sm text-text-light font-medium">Desenvolvedora Frontend - Nubank</span>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-card bg-white p-10 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden group">
                        <div class="testimonial-content mb-8">
                            <div class="flex gap-1 mb-6">
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                            </div>
                            <p class="text-lg leading-relaxed text-text-dark italic relative">"Sai de uma área completamente diferente e hoje sou Tech Lead. O suporte da equipe fez toda a diferença na minha transição."</p>
                        </div>
                        <div class="testimonial-author flex items-center gap-4">
                            <div class="w-15 h-15 bg-primary-blue rounded-full flex items-center justify-center text-white text-2xl">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="author-info">
                                <h4 class="text-lg font-bold text-text-dark mb-1">João Santos</h4>
                                <span class="text-sm text-text-light font-medium">Tech Lead - iFood</span>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-card bg-white p-10 rounded-2xl border border-border transition-all duration-500 ease-out relative overflow-hidden group">
                        <div class="testimonial-content mb-8">
                            <div class="flex gap-1 mb-6">
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                                <i class="fas fa-star text-yellow-400 text-lg"></i>
                            </div>
                            <p class="text-lg leading-relaxed text-text-dark italic relative">"Os projetos práticos me deram confiança para enfrentar qualquer desafio. Hoje trabalho remotamente para uma empresa americana!"</p>
                        </div>
                        <div class="testimonial-author flex items-center gap-4">
                            <div class="w-15 h-15 bg-primary-blue rounded-full flex items-center justify-center text-white text-2xl">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="author-info">
                                <h4 class="text-lg font-bold text-text-dark mb-1">Ana Costa</h4>
                                <span class="text-sm text-text-light font-medium">Full Stack Developer - Remote</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-32 bg-surface text-center relative reveal">
            <div class="max-w-6xl mx-auto px-6">
                <div class="max-w-4xl mx-auto opacity-0 translate-y-8 animate-fadeInUp">
                    <h2 class="text-4xl lg:text-6xl font-extrabold mb-6 text-text-dark">Pronto para Acelerar sua Carreira?</h2>
                    <p class="text-xl text-text-light mb-12 leading-relaxed">Junte-se aos milhares de profissionais que transformaram suas vidas com nossos cursos. 
                    Comece hoje e veja os resultados em poucas semanas.</p>
                    <a href="{{ route('login') }}" class="primary-btn bg-primary-blue text-white px-10 py-4 border-0 rounded-lg font-semibold text-lg cursor-pointer transition-all duration-300 ease-out no-underline inline-flex items-center gap-3 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-blue/30 after:content-['→'] after:transition-transform after:duration-300 after:ease-out hover:after:translate-x-1">Garantir Minha Vaga</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-text-dark text-white py-16 pt-16 reveal">
        <div class="max-w-6xl mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div class="footer-section">
                    <h3 class="mb-6 text-light-blue font-bold text-xl flex items-center gap-2">
                        <i class="fas fa-code"></i>
                        Programe Aqui
                    </h3>
                    <p class="text-gray-300 leading-relaxed text-base">Transformando carreiras através da excelência em educação tecnológica. 
                    Metodologia comprovada, resultados garantidos.</p>
                </div>
                <div class="footer-section">
                    <h3 class="mb-6 text-light-blue font-bold text-xl">Programas</h3>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">Full Stack JavaScript</a></p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">Python & Data Science</a></p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">React & Next.js</a></p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">DevOps & Cloud</a></p>
                </div>
                <div class="footer-section">
                    <h3 class="mb-6 text-light-blue font-bold text-xl">Recursos</h3>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">Central de Suporte</a></p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">Community</a></p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">Blog Tech</a></p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2"><a href="#" class="no-underline text-gray-300 transition-colors duration-300 hover:text-light-blue">Career Hub</a></p>
                </div>
                <div class="footer-section">
                    <h3 class="mb-6 text-light-blue font-bold text-xl">Contato</h3>
                    <p class="text-gray-300 leading-relaxed text-base mb-2">academy@devmaster.com.br</p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2">(11) 3000-2024</p>
                    <p class="text-gray-300 leading-relaxed text-base mb-2">São Paulo, SP - Brasil</p>
                </div>
            </div>
            <div class="border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Programe Aqui. Todos os direitos reservados. | Excelência em Educação Tech</p>
            </div>
        </div>
    </footer>

    <script>
        // Animated particles
        function createParticles() {
            const particles = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
                particle.style.animationDelay = Math.random() * 5 + 's';
                particles.appendChild(particle);
            }
        }

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('bg-white/95', 'shadow-2xl', 'shadow-primary-blue/10');
            } else {
                header.classList.remove('bg-white/95', 'shadow-2xl', 'shadow-primary-blue/10');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Counter animation
        function animateCounters() {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 60;
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            });
        }

        // Scroll reveal animation
        function revealElements() {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(reveal => {
                const elementTop = reveal.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    reveal.classList.add('active');
                }
            });
        }

        // Intersection Observer for better performance
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Trigger counter animation for stats section
                    if (entry.target.classList.contains('stats')) {
                        animateCounters();
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Initialize particles
        createParticles();

        // Add floating animation to code editor on hover
        const codeEditor = document.querySelector('.bg-slate-900');
        if (codeEditor) {
            codeEditor.addEventListener('mouseenter', () => {
                codeEditor.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(20px)';
            });
            
            codeEditor.addEventListener('mouseleave', () => {
                codeEditor.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(4deg) translateZ(0px)';
            });
        }

        // Dynamic typing effect for hero text (optional enhancement)
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }

        // Enhanced scroll performance
        let ticking = false;

        function updateScrollEffects() {
            revealElements();
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });

        // Load optimization
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    </script>
</body>