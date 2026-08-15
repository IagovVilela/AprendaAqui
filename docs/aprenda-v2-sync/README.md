# Patch Aprenda-Aqui-v2 — seed completo + login

Copie estes arquivos para o repositório **MateusBittenca/Aprenda-Aqui-v2**:

| Origem (esta pasta) | Destino no repo v2 |
|---------------------|-------------------|
| `packages/database/prisma/seed-tracks-data.ts` | `packages/database/prisma/seed-tracks-data.ts` |
| `packages/database/prisma/seed.ts` | `packages/database/prisma/seed.ts` |
| `apps/web/app/(auth)/login/page.tsx` | `apps/web/app/(auth)/login/page.tsx` |

## O que mudou

- **10 trilhas** (115 lições no total): HTML (25), CSS, JS, Python, Lógica, Git, SQL, React, TypeScript, APIs (10 cada).
- Lições alternando **QUIZ** e **CODE**.
- Texto demo removido da tela de login.
- Admin no seed: `aprenda@adm.com.br` / `123456` (TEACHER).

## Rodar seed (apaga todos os dados!)

```bash
pnpm db:seed
```

## Deploy

Após merge, faça redeploy no Railway e rode o seed no serviço com acesso ao MySQL.
