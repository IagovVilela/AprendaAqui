# Prompt para o agente no repositório correto (Aprenda-Aqui-v2)

Copie o bloco abaixo e cole como mensagem para o agente que roda em `MateusBittenca/Aprenda-Aqui-v2`.

---

## Contexto

Você está no repositório **`MateusBittenca/Aprenda-Aqui-v2`** — o monorepo que roda em produção no Railway (projeto **AprendaAqui**, serviços `web`, `api` e `MySQL`, domínio `aprendaaqui.up.railway.app`).

Stack: pnpm workspace, Next.js App Router em `apps/web`, serviço `api` em `apps/api`, Prisma + **MySQL** em `packages/database`. Auth é NextAuth com `authOptions` em `apps/web/lib/auth.ts`; o Prisma é importado como `import { prisma } from "database"`.

Existe um patch pronto com todo o código, escrito para este repo mas commitado em outro por falta de permissão de escrita. Ele está em:

- Repositório: `https://github.com/IagovVilela/AprendaAqui`
- Branch: `cursor/moderacao-nomes-ofensivos-8287`
- Pasta: `docs/aprenda-v2-sync/`

Dentro dessa pasta, os arquivos já estão nos **mesmos caminhos relativos** deste repo (`apps/web/...`, `apps/api/...`, `packages/database/...`). Arquivos com `.snippet.` no nome **não** são para copiar: são trechos para colar em arquivos existentes.

Comece clonando aquele repo em `/tmp` e lendo `docs/aprenda-v2-sync/README.md`, que tem a ordem de aplicação. Se não conseguir acessá-lo, implemente a partir da especificação abaixo.

## REGRA CRÍTICA — integridade dos dados

O banco de produção tem alunos reais, progresso, XP, gemas, inventário e trilhas já cadastradas. **Nada disso pode ser perdido.**

Proibido em qualquer circunstância:

- `pnpm db:seed` / `prisma db seed` no deploy ou no start
- `prisma migrate reset`, `prisma db push --force-reset`
- `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `deleteMany()` em massa
- recriar ou reiniciar o serviço MySQL, ou mexer no volume dele

Obrigatório:

- Migrations **só aditivas**: tabela nova ou coluna nova anulável
- Deploy roda **somente** `pnpm db:migrate:deploy`
- O start da api continua exatamente `pnpm db:migrate:deploy && pnpm --filter api start` — **não** acrescente seed
- Scripts de conteúdo só inserem o que ainda não existe (por `slug` / e-mail / chave), nunca alteram nem apagam o que já está lá

Se qualquer passo exigir apagar dados, **pare e explique** em vez de executar.

## O que implementar

### 1. Seed aditivo + login (corrige um risco existente)

O `packages/database/prisma/seed.ts` atual deste repo **começa com `deleteMany()`** em users, lessons, units e tracks. Isso é uma bomba: quem rodar `pnpm db:seed` por engano apaga a base inteira.

Substitua por um seed aditivo que:

- não chama `deleteMany` em nada
- percorre um catálogo de 10 trilhas (HTML, CSS, JavaScript, Python, Lógica, Git, SQL, React, TypeScript, APIs HTTP; 115 lições) e cria **apenas** as trilhas cujo `slug` ainda não existe — trilha já gravada fica intacta
- cria o admin `aprenda@adm.com.br` (role TEACHER) **só se o e-mail não existir**, sem resetar senha de ninguém
- em produção (`NODE_ENV=production` ou `RAILWAY_ENVIRONMENT=production`) **não executa nada**, a menos que `RUN_ENSURE_CONTENT=true` esteja definido explicitamente

Também remova o texto de credenciais demo (`demo@...` / `professor@...`) de `apps/web/app/(auth)/login/page.tsx` — são placeholders que não existem no banco e confundem o usuário.

### 2. Avatar 3D customizável comprado com gemas

Cada aluno ganha um personagem 3D em `/avatar`, gira o modelo, muda pele/cabelo/camisa/calça e compra acessórios com as **gemas que já existem** na loja.

- Migration: `ALTER TABLE users ADD COLUMN avatar_config JSON NULL` (anulável de propósito — quem já tem conta fica com `NULL` e usa o avatar padrão)
- Prisma: `avatarConfig Json? @map("avatar_config")` no model `User`
- Catálogo de 33 itens em 10 slots: cabelo, chapéu, óculos, rosto, pescoço, capa, mochila, mãos, mascote e paletas de cor. Cabelo curto e cacheado são grátis; o resto custa de 40 a 350 gemas
- Compra debita `users.gems` e grava em **`user_inventory_items`** (a tabela de inventário que a loja já usa) — não precisa criar tabela nova nem mexer em `store-items.ts`
- Renderização com `three` + `@react-three/fiber` + `@react-three/drei`, geometria low-poly (sem asset externo). Carregue o viewer com `next/dynamic` e `ssr: false`
- Também gere um preview 2D em SVG, leve, para usar em listas (ranking, perfil)
- Rotas: `GET /api/avatar` (config, gemas, inventário, catálogo), `POST /api/avatar/purchase`, `POST /api/avatar/equip`, `PATCH /api/avatar/appearance`
- Valide no servidor: só equipa item que o usuário possui, e só aceita cor da paleta liberada (cores neon/pastel exigem a paleta comprada)

### 3. Equipes, guerras entre equipes e motor de quiz ao vivo

Sistema social-competitivo inspirado em clãs do Clash Royale e no Kahoot, com o conteúdo vindo das trilhas da própria plataforma.

**Equipes** — papéis `OWNER` / `ADMIN` / `MEMBER` com permissões checadas no servidor. Dono transfere posse, dissolve e promove; admin aceita/expulsa membros, edita a equipe e declara guerra; membro participa e vê o ranking interno.

**Competição interna** — admin abre um "desafio interno": quiz ao vivo entre os membros. Pontuação acumula em `seasonPoints` / `weekPoints` do membro, formando o ranking interno.

**Guerra** — uma equipe desafia outra. Fase de **preparação de 24h** em que os membros confirmam presença, depois **batalha** (quiz ao vivo simultâneo) e **resultado** com pontos de liga.

**Motor de quiz (reutilizável pelos dois modos)** — Socket.io no serviço `api`, namespace `/quiz`. Anexe ao **mesmo servidor HTTP** que a api já expõe, para o Railway seguir com uma porta só e o healthcheck `/health` continuar funcionando.

Decisões já tomadas, com o motivo — mantenha:

| Ponto | Decisão | Por quê |
|---|---|---|
| Entrada na equipe | código de convite **e** solicitação aprovada (`joinPolicy` por equipe) | turma fechada de escola quer convite; equipe aberta quer crescer sozinha. Um modelo só atenderia metade dos casos |
| Placar da equipe | **média** dos que responderam + mínimo de participantes | soma premiaria a equipe com mais gente ativa; média sem piso premiaria mandar só o melhor aluno. É por isso que o Kahoot usa média no team mode e o Clash exige mínimo |
| Limite de membros | 25 | acima disso a página e o ranking interno ficam ilegíveis |
| Mínimo para guerra | 5 confirmados, nas **duas** equipes | evita vitória fácil contra equipe desfalcada |
| Preparação | 24h, tema (trilha) visível para os dois lados | informação simétrica deixa os alunos estudarem — melhor pedagogicamente que surpresa |
| Uma equipe por aluno | `UNIQUE` em `team_members.user_id` | garantido pelo banco, não por checagem na aplicação |
| Emblema | SVG determinístico a partir de uma seed | zero storage e zero moderação de imagem; upload fica para depois |

**Pontuação:** `pontos = base × (0.5 + 0.5 × tempoRestante / tempoLimite)`, com base 600/800/1000 por dificuldade. Acerto vale no mínimo 50% da base; erro vale 0. O tempo é medido **no servidor** a partir de `questionStartedAt` — o cliente nunca informa quanto demorou.

**Banco de perguntas:** derivado das lições `QUIZ` já cadastradas (o campo `content.questions`). Escreva um script idempotente que cria só as perguntas que ainda não existem, sem alterar lição nenhuma. É esse o diferencial: a batalha cobra o que o aluno estudou aqui, não trivia genérica.

**Anti-fraude do MVP:**

- alternativas embaralhadas **por participante**, com permutação determinística por (participante, pergunta); o cliente responde pelo índice que viu na tela e o servidor traduz para o índice real
- resposta fora da janela do servidor é rejeitada
- `UNIQUE (participant_id, question_id)` — segunda resposta na mesma pergunta é ignorada
- limite de submissões por sessão por participante
- token curto e dedicado para o WebSocket (assinado com o mesmo `NEXTAUTH_SECRET`), em vez de expor o cookie httpOnly da sessão

**Rejoin:** o estado da sala é persistido no MySQL, não só em memória. Se o aluno cair, ele reentra e **retoma a pontuação**; se o processo reiniciar, a sala é reconstruída do banco.

Tabelas novas: `teams`, `team_members`, `team_invites`, `team_join_requests`, `team_wars`, `team_war_participants`, `quiz_questions`, `quiz_sessions`, `quiz_session_questions`, `quiz_participants`, `quiz_answers`.

Fora do MVP: matchmaking automático (só desafio direto), upload de emblema, liga com promoção/rebaixamento.

### 4. Moderação de nomes ofensivos

Com o crescimento do cadastro apareceram nomes com palavrão, ofensa a grupos, conteúdo sexual e gente se passando por "Admin"/"Suporte". O nome aparece no ranking, no perfil, na equipe e na sala ao vivo — é o campo mais visível do sistema.

**Dois níveis de severidade, e isso é o ponto central:**

- `BLOCK` — não deixa cadastrar. Casos inequívocos.
- `REVIEW` — **deixa passar** e manda para uma fila do professor.

Motivo: "Pinto" é sobrenome; "Cunha", "Assunção", "Cuiabá", "Conceição" contêm sequências que uma blocklist ingênua barraria. Impedir o cadastro de um aluno real é pior que o problema original, e ele não entende o motivo. Falso positivo tem que virar trabalho de revisão, não porta fechada.

**Normalização antes de comparar** (senão o filtro cai em qualquer variação boba): remover acentos, converter leetspeak (`4→a`, `0→o`, `1→i`, `@→a`, `$→s`...), colapsar letras repetidas e remontar letras soltas. Precisa bloquear `c4r4lh0`, `CARAAAALHO`, `C U`, `f i l h o d a p u t a`, `bUcEtA`, `vi@do`, `n1gg4`, `Admin`, `Suporte Oficial`, links e nome só com emoji — e precisa deixar passar `João Silva`, `Ana Cunha`, `Carlos Cuiabá`, `Maria da Conceição`, `José Assessoria`.

**Casamento por termo:** `token` (palavra inteira) para termos curtos ou que também são sobrenome; `contains` só para termos longos, que não aparecem dentro de palavra legítima. Mais uma allowlist de palavras comuns.

**Aplicar em:** cadastro (`apps/web/app/api/auth/register/route.ts` — este é o ponto mais importante, barrar antes de criar a conta), troca de nome no perfil, e nome/descrição de equipe. Inclua também uma rota de validação enquanto a pessoa digita.

**Painel do professor** em `/professor/moderacao` (só role `TEACHER`): fila de revisão com o valor tentado e o termo que casou, denúncias de alunos (com limite por hora, para a denúncia não virar assédio), **renome forçado** para nomes que já estavam no banco antes do filtro, e termos editáveis **sem deploy**.

O renome forçado troca **apenas o nome exibido**. Conta, XP, gemas, progresso e inventário ficam intactos.

Tabelas novas: `moderation_terms` e `moderation_events`. **Nenhuma coluna de `users` é alterada** e nenhum usuário existente é renomeado automaticamente.

## Como aplicar

```bash
# 1. colar os snippets de schema no packages/database/prisma/schema.prisma
#    (avatar, teams/quiz, moderation) e as relações indicadas em User/Track/Lesson
# 2. copiar as pastas de migration
pnpm db:migrate:deploy
pnpm --filter database generate

# 3. dependências
pnpm --filter web add three @react-three/fiber @react-three/drei socket.io-client
pnpm --filter web add -D @types/three
pnpm --filter api add socket.io

# 4. banco de perguntas das batalhas (aditivo, pode rodar quantas vezes quiser)
pnpm --filter database exec tsx scripts/sync-question-bank.ts
```

Exporte os módulos novos em `packages/database/src/index.ts` e acrescente na navegação: `/avatar`, `/equipes` e, para professor, `/professor/moderacao`.

Variáveis de ambiente novas: `NEXT_PUBLIC_REALTIME_URL` (web, aponta para a URL pública da api) e `WEB_ORIGIN` (api, para o CORS do Socket.io). O `NEXTAUTH_SECRET` já existe nos dois serviços e precisa ser o mesmo.

Se as versões de `@react-three/fiber` e `drei` não baterem com a versão do React do projeto, ajuste: React 19 usa fiber 9 / drei 10; React 18 usa fiber 8 / drei 9.

## Verificação antes de abrir o PR

1. `pnpm build` passa
2. Nenhuma migration tem `DROP`, `TRUNCATE` ou alteração de coluna existente
3. `grep -rn "deleteMany" packages/database/prisma/seed.ts` não retorna nada
4. O start da api não contém `db:seed`
5. Teste o filtro de nomes com os casos citados: nenhum falso positivo nos nomes legítimos
6. Se possível, suba local e confirme: login continua funcionando, trilhas e gemas intactas, `/avatar` renderiza, `/equipes` cria equipe, e uma sala de quiz sincroniza entre duas abas

## Entrega

Crie uma branch, faça commits separados por mudança lógica (schema → domínio → APIs → tempo real → UI → docs) e abra **um PR em draft** contra `main` explicando as decisões e confirmando que nenhuma migration é destrutiva.

**Não** faça merge nem deploy sem revisão humana. Depois do merge, o Railway faz o deploy sozinho e roda só a migration.
