# Patch Aprenda-Aqui-v2

Copie os arquivos desta pasta para o repositório **MateusBittenca/Aprenda-Aqui-v2** nos mesmos caminhos.

## 1. Seed + login (trilhas)

| Origem | Destino no repo v2 |
|--------|--------------------|
| `packages/database/prisma/seed-tracks-data.ts` | `packages/database/prisma/seed-tracks-data.ts` |
| `packages/database/prisma/seed.ts` | `packages/database/prisma/seed.ts` |
| `apps/web/app/(auth)/login/page.tsx` | `apps/web/app/(auth)/login/page.tsx` |

- **10 trilhas** (115 lições): HTML (25) + CSS, JS, Python, Lógica, Git, SQL, React, TypeScript, APIs (10 cada)
- Texto demo removido da tela de login
- Admin: `aprenda@adm.com.br` / `123456` (TEACHER)

`pnpm db:seed` **apaga todos os dados**. Use só em banco vazio/dev.

## 2. Avatar 3D + acessórios na loja de gemas

Instruções completas: **[AVATAR.md](./AVATAR.md)**

Resumo: cada usuário ganha um personagem 3D em `/avatar`, compra chapéus/óculos/capas/mascotes com gemas e equipa no estúdio. A compra usa o inventário já existente (`user_inventory_items`) e debita `users.gems`.
