# Patch Aprenda-Aqui-v2

Copie os arquivos desta pasta para o repositório **MateusBittenca/Aprenda-Aqui-v2** nos mesmos caminhos.

**Regra:** o deploy **não pode apagar** usuários, progresso, gemas nem o seed que já está no banco. Detalhes: [DATA-INTEGRITY.md](./DATA-INTEGRITY.md).

## 1. Trilhas + login

| Origem | Destino no repo v2 |
|--------|--------------------|
| `packages/database/prisma/seed-tracks-data.ts` | `packages/database/prisma/seed-tracks-data.ts` |
| `packages/database/prisma/seed.ts` | `packages/database/prisma/seed.ts` |
| `apps/web/app/(auth)/login/page.tsx` | `apps/web/app/(auth)/login/page.tsx` |

- Catálogo de **10 trilhas** (115 lições) usado só para **inserir o que ainda não existe** (por `slug`)
- Trilhas já gravadas no banco **não são alteradas nem apagadas**
- Texto demo removido da tela de login
- Admin `aprenda@adm.com.br` é criado **somente se o e-mail ainda não existir**

Em produção: `pnpm db:migrate:deploy` — **não rode seed no deploy**.

Se quiser só completar trilhas novas num banco que já tem dados:

```bash
pnpm db:seed
```

Esse seed **não apaga nada**. Ele ignora slugs existentes e só cria os que faltam.

## 2. Avatar 3D + acessórios na loja de gemas

Instruções: **[AVATAR.md](./AVATAR.md)**

A migration do avatar só adiciona a coluna `avatar_config` (nullable). Os usuários atuais continuam iguais e recebem o avatar padrão até customizarem.
