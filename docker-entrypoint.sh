#!/bin/sh

# Garante que variáveis de ambiente (Railway) prevaleçam sobre cache antigo
php artisan config:clear 2>/dev/null || true

# Railway costuma subir o app antes do MySQL aceitar conexões — tenta várias vezes
# Erro 2002 "Connection refused" também aparece se DB_HOST for localhost sem MySQL local
MAX_ATTEMPTS=40
n=0
while true; do
  if php artisan migrate --force; then
    break
  fi
  n=$((n + 1))
  if [ "$n" -ge "$MAX_ATTEMPTS" ]; then
    echo "ERRO: não foi possível conectar ao MySQL após $MAX_ATTEMPTS tentativas."
    echo "Confira no Railway: serviço MySQL ligado ao mesmo projeto, e variáveis DATABASE_URL ou DB_HOST/DB_PORT/DB_DATABASE/DB_USERNAME/DB_PASSWORD."
    exit 1
  fi
  echo "Aguardando banco de dados... ($n/$MAX_ATTEMPTS)"
  sleep 3
done

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
