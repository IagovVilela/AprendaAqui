# Avatar 3D + loja de acessórios (Aprenda-Aqui-v2)

Cada aluno recebe um personagem 3D. Gemas da loja compram chapéus, óculos, capas, mascotes e paletas de cor. Itens comprados entram em `user_inventory_items` (o inventário que a loja já usa).

## O que o aluno vê

- Nova rota **`/avatar`**: estúdio 3D (girar o personagem) + abas de customização
- Compra com gemas; depois **Equipar** / **Remover**
- Preview 2D leve para listas (ranking/perfil) e viewer 3D no estúdio/perfil

## Catálogo (33 itens)

| Slot | Exemplos | Preço |
|------|----------|--------|
| Cabelo | curto e cacheado (grátis), longo, coque, moicano, rabo | 0–90 |
| Chapéu | gorro, boné, coroa, mago, fone, hélice, capacete | 80–280 |
| Óculos | redondo, pixel, visor cyber, estrela | 70–160 |
| Rosto | máscara ninja, blush | 40–100 |
| Pescoço | cachecol, gravata, medalha | 80–240 |
| Capa | verde, heroica | 180–260 |
| Mochila | escolar, foguete | 110–300 |
| Mãos | notebook, varinha | 140–190 |
| Mascote | gato código, bugzinho, robô | 280–350 |
| Paleta | neon e pastel (desbloqueiam cores de cabelo) | 150 |

## Como aplicar no `MateusBittenca/Aprenda-Aqui-v2`

Copie os arquivos desta pasta para o **mesmo caminho** no repo v2.

### 1. Banco (MySQL + Prisma)

1. Cole o campo de `packages/database/prisma/schema-avatar.snippet.prisma` no `model User`:

```prisma
avatarConfig Json? @map("avatar_config")
```

2. Copie a migration:

`packages/database/prisma/migrations/20260818120000_add_avatar_config/migration.sql`

3. No servidor:

```bash
pnpm db:migrate:deploy
pnpm --filter database generate
```

Não rode `pnpm db:seed` só por causa do avatar — o seed **apaga todos os dados**. O seed atualizado só é necessário em ambiente vazio/dev. Em produção, a migration basta: cada usuário começa com o avatar padrão.

### 2. Dependências 3D (`apps/web`)

Adicione o conteúdo de `apps/web/package-avatar-deps.json` e rode `pnpm install`.

- React 19 → fiber v9 + drei v10 (valores do JSON)
- React 18 → fiber v8 + drei v9 (`react18Fallback`)

Se o `next.config.mjs` já tiver `transpilePackages`, inclua `"three"`.

### 3. Navegação

Em `apps/web/components/dashboard/sidebar.tsx` e `mobile-nav.tsx`, acrescente:

```tsx
{ href: "/avatar", label: "Avatar", icon: UserRound }
```

(`UserRound` vem de `lucide-react`.)

### 4. Perfil

Em `user-profile-view.tsx` (e no payload de `public-profile` se o perfil de outro aluno for público):

```tsx
import { parseAvatarConfig } from "@/lib/avatar-config";
import { AvatarProfileCard } from "@/components/avatar/avatar-profile-card";

<AvatarProfileCard
  name={user.name}
  config={parseAvatarConfig(user.avatarConfig)}
/>
```

O `select` do Prisma do perfil precisa incluir `avatarConfig`.

### 5. Loja `/loja` (opcional)

O estúdio em `/avatar` já vende os acessórios. Se quiser um atalho na loja atual, coloque um card:

“Personalize seu avatar 3D” → `/avatar`

Não é obrigatório alterar `store-items.ts` nem `/api/store/purchase`: o avatar tem APIs próprias (`/api/avatar/*`) que debitam `User.gems` e gravam o mesmo `UserInventoryItem`.

## Rotas novas

| Método | Rota | Função |
|--------|------|--------|
| GET | `/api/avatar` | config, gemas, inventário, catálogo |
| POST | `/api/avatar/purchase` | compra com gemas |
| POST | `/api/avatar/equip` | equipa / remove item de um slot |
| PATCH | `/api/avatar/appearance` | cores (pele, cabelo, camisa, calça) |

## Arquivos

```
packages/database/src/avatar-config.ts
packages/database/src/avatar-items.ts
packages/database/prisma/schema-avatar.snippet.prisma
packages/database/prisma/migrations/20260818120000_add_avatar_config/migration.sql
packages/database/prisma/seed.ts          ← demo ganha coroa, capa, gato e paleta neon
apps/web/lib/avatar-config.ts
apps/web/lib/avatar-items.ts
apps/web/components/avatar/*
apps/web/app/(dashboard)/avatar/page.tsx
apps/web/app/api/avatar/**
```

`apps/web/lib/avatar-*.ts` e `packages/database/src/avatar-*.ts` devem permanecer iguais (catálogo único).

## Depois do deploy

1. Railway: migrate
2. Abrir `/avatar` logado
3. Comprar um item e ver o 3D atualizar ao equipar
