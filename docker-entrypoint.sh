#!/bin/sh
set -e

# Garante que variáveis de ambiente (Railway) prevaleçam sobre cache antigo
php artisan config:clear 2>/dev/null || true

# Cria tabelas (cache, sessions, jobs, etc.) — necessário para CACHE_STORE/QUEUE com driver database
php artisan migrate --force

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
