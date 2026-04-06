#!/bin/sh

# Garante que variáveis de ambiente (Railway) prevaleçam sobre cache antigo
php artisan config:clear 2>/dev/null || true

# Opcional: SKIP_DB_MIGRATE=1 só para diagnóstico local (não use em produção)
if [ "${SKIP_DB_MIGRATE:-0}" = "1" ]; then
  echo "SKIP_DB_MIGRATE=1 — pulando migrate (apenas diagnóstico)."
else
  MAX_ATTEMPTS=40
  n=0
  while true; do
    # --force = produção sem confirmação; --no-interaction = nunca pede input
    if php artisan migrate --force --no-interaction; then
      echo "Migrações aplicadas com sucesso."
      break
    fi
    n=$((n + 1))
    if [ "$n" -ge "$MAX_ATTEMPTS" ]; then
      echo "ERRO: migrate falhou após $MAX_ATTEMPTS tentativas. Corrija a conexão MySQL no Railway."
      exit 1
    fi
    echo "Aguardando banco de dados... ($n/$MAX_ATTEMPTS)"
    sleep 3
  done
fi

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
