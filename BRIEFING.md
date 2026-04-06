# 📋 BRIEFING DO SISTEMA - APRENDA AQUI

## 🎯 1. VISÃO GERAL DO PROJETO

### Nome do Sistema
**Aprenda Aqui** (também referenciado como "Programe Aqui" na landing page)

### Propósito Principal
Plataforma de educação online focada em programação e tecnologia, oferecendo cursos, mentoria e suporte para transformação de carreira na área tech.

### Objetivo de Negócio
- Capacitar pessoas para ingressar no mercado de tecnologia
- Oferecer metodologia comprovada de ensino
- Garantir empregabilidade através de parcerias com empresas
- Criar uma comunidade de desenvolvedores

---

## 🏗️ 2. ARQUITETURA E TECNOLOGIAS

### Stack Tecnológico
- **Backend**: Laravel 12.28.1
- **Frontend**: Livewire 3.x, Tailwind CSS 4.0
- **Banco de Dados**: SQLite (desenvolvimento)
- **Build Tool**: Vite 7.x
- **Containerização**: Docker + Laravel Sail
- **PHP**: 8.4+

### Estrutura do Projeto
```
AprendaAqui/
├── app/
│   ├── Http/Controllers/     # Controladores MVC
│   ├── Livewire/             # Componentes Livewire
│   ├── Models/               # Modelos Eloquent
│   └── Providers/           # Service Providers
├── resources/
│   ├── views/               # Templates Blade
│   ├── css/                 # Estilos
│   └── js/                  # JavaScript
├── routes/
│   └── web.php              # Rotas da aplicação
└── database/
    └── migrations/          # Migrações do banco
```

---

## 🎨 3. FUNCIONALIDADES ATUAIS

### 3.1 Sistema de Autenticação ✅
- **Registro de Usuários**
  - Formulário com validação (Livewire)
  - Campos: Nome, Email, Senha, Confirmação de Senha
  - Hash de senha automático
  - Login automático após registro

- **Login de Usuários**
  - Autenticação via sessão
  - Middleware de proteção
  - Remember me (opcional)

- **Logout**
  - Encerramento de sessão
  - Redirecionamento para home

### 3.2 Landing Page (Home) ✅
- **Hero Section**
  - Título impactante: "Domine a Programação e Transforme sua Carreira"
  - CTAs principais (Login/Registro)
  - Editor de código animado

- **Seções de Conteúdo**
  - Diferenciais (Projetos Enterprise, Mentoria Senior, Garantia de Colocação)
  - Tecnologias ensinadas (Frontend, Backend, Mobile & DevOps)
  - Estatísticas (8.500+ desenvolvedores, 96% empregabilidade, etc.)
  - Depoimentos de alunos
  - Footer com informações de contato

### 3.3 Dashboard (Área Protegida) ✅
- **Informações do Usuário**
  - Nome, Email, Data de cadastro
  - Status de autenticação

- **Cards de Recursos** (placeholders)
  - Cursos
  - Certificados
  - Comunidade
  - Progresso

---

## 🎯 4. FUNCIONALIDADES PLANEJADAS (A IMPLEMENTAR)

### 4.1 Sistema de Cursos
- [ ] CRUD de cursos
- [ ] Categorização (Frontend, Backend, Mobile, DevOps)
- [ ] Módulos e aulas
- [ ] Conteúdo em vídeo/texto
- [ ] Progresso do aluno
- [ ] Certificados de conclusão

### 4.2 Sistema de Usuários Avançado
- [ ] Perfil do usuário
- [ ] Upload de foto/avatar
- [ ] Histórico de cursos
- [ ] Conquistas/badges
- [ ] Níveis de experiência

### 4.3 Comunidade
- [ ] Fórum de discussão
- [ ] Chat entre alunos
- [ ] Grupos de estudo
- [ ] Compartilhamento de projetos

### 4.4 Sistema de Pagamentos
- [ ] Integração com gateway de pagamento
- [ ] Planos de assinatura
- [ ] Cursos gratuitos vs. pagos
- [ ] Histórico de transações

### 4.5 Mentoria
- [ ] Agendamento de sessões
- [ ] Sistema de tickets/suporte
- [ ] Chat com mentores
- [ ] Feedback personalizado

### 4.6 Colocação no Mercado
- [ ] Portal de vagas
- [ ] Parcerias com empresas
- [ ] Preparação para entrevistas
- [ ] Portfolio de projetos

---

## 🎨 5. DESIGN E UX

### Identidade Visual
- **Cores Principais**:
  - Azul Primário: `#1e40af`
  - Azul Secundário: `#3b82f6`
  - Azul Claro: `#60a5fa`
  - Texto Escuro: `#1f2937`
  - Texto Claro: `#6b7280`

- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Font Awesome 6.4.0

### Princípios de Design
- ✅ Interface moderna e limpa
- ✅ Animações suaves e profissionais
- ✅ Responsivo (mobile-first)
- ✅ Acessibilidade
- ✅ Performance otimizada

### Componentes UI
- Cards com hover effects
- Botões com animações
- Formulários com validação visual
- Loading states
- Flash messages (sucesso/erro)

---

## 🔐 6. SEGURANÇA E PERMISSÕES

### Implementado ✅
- Autenticação Laravel padrão
- Hash de senhas (bcrypt)
- Middleware de autenticação
- Proteção CSRF
- Validação de formulários

### A Implementar
- [ ] Verificação de email
- [ ] Recuperação de senha
- [ ] 2FA (autenticação de dois fatores)
- [ ] Roles e permissões (Admin, Instrutor, Aluno)
- [ ] Rate limiting
- [ ] Logs de auditoria

---

## 📊 7. BANCO DE DADOS

### Estrutura Atual
- **users**: Tabela de usuários (padrão Laravel)
- **cache**: Cache de sessões
- **jobs**: Fila de jobs

### Estrutura Planejada
```
- courses (cursos)
- modules (módulos)
- lessons (aulas)
- enrollments (matrículas)
- progress (progresso)
- certificates (certificados)
- payments (pagamentos)
- mentors (mentores)
- sessions (sessões de mentoria)
- forum_posts (posts do fórum)
- projects (projetos dos alunos)
```

---

## 🚀 8. ROADMAP DE DESENVOLVIMENTO

### Fase 1: Fundação ✅ (CONCLUÍDA)
- [x] Setup do projeto Laravel
- [x] Autenticação básica
- [x] Landing page
- [x] Dashboard básico
- [x] Configuração Docker

### Fase 2: Sistema de Cursos (PRÓXIMA)
- [ ] Modelo de dados de cursos
- [ ] CRUD de cursos (admin)
- [ ] Visualização de cursos (aluno)
- [ ] Sistema de matrícula
- [ ] Player de vídeo/aula

### Fase 3: Conteúdo e Progresso
- [ ] Sistema de módulos e aulas
- [ ] Tracking de progresso
- [ ] Certificados
- [ ] Notas e avaliações

### Fase 4: Comunidade e Interação
- [ ] Fórum
- [ ] Chat
- [ ] Compartilhamento de projetos
- [ ] Sistema de badges

### Fase 5: Monetização
- [ ] Sistema de pagamentos
- [ ] Planos de assinatura
- [ ] Cursos gratuitos vs. pagos

### Fase 6: Mentoria e Suporte
- [ ] Sistema de agendamento
- [ ] Chat com mentores
- [ ] Sistema de tickets

### Fase 7: Colocação no Mercado
- [ ] Portal de vagas
- [ ] Parcerias
- [ ] Preparação para entrevistas

---

## 📝 9. PADRÕES DE CÓDIGO

### Convenções Laravel
- **Controllers**: PascalCase (ex: `DashboardController`)
- **Models**: PascalCase, singular (ex: `User`)
- **Views**: kebab-case (ex: `dashboard/index.blade.php`)
- **Routes**: kebab-case (ex: `/dashboard`)

### Estrutura de Pastas
- Controllers em `app/Http/Controllers`
- Livewire components em `app/Livewire`
- Views organizadas por feature
- Migrations com timestamps

### Boas Práticas
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Mensagens de feedback
- ✅ Código limpo e documentado
- ⚠️ Testes (a implementar)

---

## 🔧 10. CONFIGURAÇÃO E DEPLOY

### Ambiente de Desenvolvimento
- **Docker**: Porta 8001
- **Banco**: SQLite (desenvolvimento)
- **Vite**: Porta 5173 (dev server)

### Comandos Úteis
```bash
# Iniciar containers
docker-compose up -d

# Executar migrações
docker-compose exec laravel.test php artisan migrate

# Instalar dependências
docker-compose exec laravel.test composer install
docker-compose exec laravel.test npm install

# Compilar assets
docker-compose exec laravel.test npm run build

# Ver logs
docker-compose logs -f laravel.test
```

### Ambiente de Produção (Planejado)
- [ ] Configurar MySQL/PostgreSQL
- [ ] Configurar Redis para cache
- [ ] Configurar fila de jobs
- [ ] CDN para assets
- [ ] SSL/HTTPS
- [ ] Backup automático

---

## 📈 11. MÉTRICAS E KPIs

### Métricas de Negócio (Planejadas)
- Número de alunos cadastrados
- Taxa de conclusão de cursos
- Taxa de empregabilidade
- Receita mensal recorrente (MRR)
- NPS (Net Promoter Score)

### Métricas Técnicas
- Tempo de carregamento
- Taxa de erro
- Uptime
- Performance de queries

---

## 🎯 12. OBJETIVOS ESTRATÉGICOS

### Curto Prazo (3 meses)
1. Implementar sistema completo de cursos
2. Lançar primeira turma beta
3. Obter 100+ alunos cadastrados
4. Implementar sistema de pagamentos

### Médio Prazo (6 meses)
1. Expandir catálogo de cursos
2. Implementar mentoria
3. Parcerias com 10+ empresas
4. Sistema de certificados

### Longo Prazo (12 meses)
1. 1.000+ alunos ativos
2. Portal de vagas funcionando
3. Comunidade engajada
4. ROI positivo

---

## 👥 13. PERFIS DE USUÁRIO

### Aluno
- Cadastro e login
- Navegação de cursos
- Acesso a conteúdo
- Acompanhamento de progresso
- Certificados
- Comunidade

### Instrutor (Futuro)
- Criação de cursos
- Gerenciamento de conteúdo
- Interação com alunos
- Analytics de cursos

### Administrador (Futuro)
- Gestão completa da plataforma
- Gerenciamento de usuários
- Configurações gerais
- Relatórios e analytics

---

## 📚 14. DOCUMENTAÇÃO

### Documentação Técnica
- [ ] README.md atualizado
- [ ] Documentação de API (se houver)
- [ ] Guia de instalação
- [ ] Guia de contribuição

### Documentação de Usuário
- [ ] Guia do aluno
- [ ] FAQ
- [ ] Tutoriais em vídeo
- [ ] Central de ajuda

---

## ✅ 15. CHECKLIST DE QUALIDADE

### Código
- [x] Estrutura organizada
- [x] Validações implementadas
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Cobertura de testes > 80%

### Segurança
- [x] Autenticação implementada
- [x] Hash de senhas
- [ ] Verificação de email
- [ ] Rate limiting
- [ ] Auditoria de logs

### Performance
- [ ] Cache implementado
- [ ] Otimização de queries
- [ ] Lazy loading
- [ ] Compressão de assets
- [ ] CDN configurado

### UX/UI
- [x] Design responsivo
- [x] Animações suaves
- [ ] Acessibilidade (WCAG)
- [ ] Loading states
- [ ] Error handling visual

---

## 🎓 16. CONCLUSÃO

O **Aprenda Aqui** é uma plataforma de educação em programação com foco em resultados práticos e empregabilidade. O sistema está na fase inicial, com autenticação e landing page funcionais. O próximo passo é implementar o sistema completo de cursos, que será o coração da plataforma.

### Próximos Passos Imediatos
1. Criar modelos e migrações para cursos
2. Implementar CRUD de cursos
3. Desenvolver interface de visualização de cursos
4. Sistema de matrícula

---

**Última atualização**: 13/11/2025  
**Versão do Documento**: 1.0  
**Autor**: Sistema de Análise Automática

