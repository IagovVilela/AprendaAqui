# Patch Aprenda-Aqui-v2

Copie os arquivos desta pasta para o repositório **MateusBittenca/Aprenda-Aqui-v2** nos mesmos caminhos.

**Regra:** o deploy **não pode apagar** usuários, progresso, gemas nem o seed que já está no banco. Detalhes: [DATA-INTEGRITY.md](./DATA-INTEGRITY.md).

Todas as features abaixo são **novas e aditivas**: nenhuma tabela existente é alterada ou removida.

## 1. Trilhas + login

| Origem | Destino no repo v2 |
|--------|--------------------|
| `packages/database/prisma/seed-tracks-data.ts` | mesmo caminho |
| `packages/database/prisma/seed.ts` | mesmo caminho |
| `apps/web/app/(auth)/login/page.tsx` | mesmo caminho |

- Catálogo de **10 trilhas** (115 lições) usado só para **inserir o que ainda não existe** (por `slug`)
- Trilhas já gravadas no banco **não são alteradas nem apagadas**
- Texto demo removido da tela de login
- Admin `aprenda@adm.com.br` criado **somente se o e-mail ainda não existir**

Em produção: `pnpm db:migrate:deploy` — **não rode seed no deploy**.

## 2. Avatar 3D + acessórios na loja de gemas

Instruções: **[AVATAR.md](./AVATAR.md)**

Migration só adiciona `avatar_config` (nullable). Usuários atuais recebem o avatar padrão.

## 3. Equipes, guerras e quiz ao vivo

Instruções e decisões de projeto: **[TEAMS-BATTLES.md](./TEAMS-BATTLES.md)**

- Equipes com dono/admin/membro, convite por código e solicitação aprovada
- Desafio interno da equipe e **guerra** entre equipes (preparação → batalha → resultado)
- Motor de quiz ao vivo estilo Kahoot via Socket.io, com rejoin e janela de tempo do servidor
- Perguntas geradas a partir das **lições QUIZ já existentes** na plataforma

Migration só **cria tabelas novas** (`teams`, `team_members`, `team_wars`, `quiz_*`, ...).

## 4. Moderação de nomes ofensivos

Instruções: **[MODERATION.md](./MODERATION.md)**

- Filtro no cadastro, na troca de nome e no nome/descrição de equipe
- Resistente a leetspeak (`c4r4lh0`), letras repetidas (`caraaaalho`) e letras soltas (`C U`)
- Dois níveis: `BLOCK` barra; `REVIEW` deixa passar e manda para o professor (evita barrar sobrenome real, como Pinto ou Cunha)
- Painel em `/professor/moderacao`: fila de revisão, denúncias, renome forçado e termos editáveis sem deploy

Migration cria só `moderation_terms` e `moderation_events`. Nenhum usuário existente é alterado.

## Ordem de aplicação

```bash
# 1. schema: colar os snippets no schema.prisma (avatar + teams)
# 2. migrations: copiar as duas pastas de migration
pnpm db:migrate:deploy
pnpm --filter database generate

# 3. dependências
pnpm --filter web add three @react-three/fiber @react-three/drei socket.io-client
pnpm --filter web add -D @types/three
pnpm --filter api add socket.io

# 4. popular o banco de perguntas das batalhas (aditivo, pode repetir)
pnpm --filter database exec tsx scripts/sync-question-bank.ts

# 5. moderação: aplicar o snippet em apps/web/app/api/auth/register/route.ts
```

Nenhum desses passos apaga dados.
