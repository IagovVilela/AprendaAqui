# Integridade dos dados — regra permanente

O banco de produção (Railway / MySQL) já tem alunos, professores, progresso, gemas, inventário e o **seed atual de trilhas**. Isso não pode ser perdido.

## Deploy (Railway)

Permitido:

```bash
pnpm db:migrate:deploy
```

Proibido no start/deploy:

- `pnpm db:seed`
- `prisma db seed`
- `prisma migrate reset`
- `prisma db push --force-reset`
- qualquer `DELETE`/`TRUNCATE` em massa

O comando de start da API deve continuar no formato:

```bash
pnpm db:migrate:deploy && pnpm --filter api start
```

**Não acrescente `db:seed` nesse comando.**

O seed **não viaja no deploy**. Alunos, gemas e trilhas já estão no MySQL. O deploy só envia código. Em produção o `seed.ts` **não executa** (sai imediatamente), a menos que alguém defina `RUN_ENSURE_CONTENT=true` de propósito.

## Seed (`pnpm db:seed`)

O `packages/database/prisma/seed.ts` deste patch é **aditivo**:

- Não chama `deleteMany`
- Se a trilha (slug) já existe, **não mexe** (o seed atual permanece)
- Só **cria** trilhas cujo slug ainda não está no banco
- Só cria o admin se `aprenda@adm.com.br` ainda não existir (não reseta senha)

Mesmo assim, em produção o caminho normal é **só a migration**. O seed aditivo é para completar trilhas novas em ambiente que já tem dados, sem wipe.

## Avatar

A migration só faz `ADD COLUMN avatar_config JSON NULL`. Usuários atuais ficam com `NULL` e o app usa o avatar padrão. Nada é apagado.
