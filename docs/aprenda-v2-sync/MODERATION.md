# Moderação de nomes ofensivos

Feature **nova e aditiva**. Nenhum usuário existente é apagado, renomeado automaticamente ou bloqueado. Quem já está cadastrado continua entrando normalmente.

## O problema

Com o crescimento do cadastro, começaram a aparecer nomes com palavrão, ofensa a grupos, conteúdo sexual e gente se passando por "Admin"/"Suporte". O nome aparece no ranking, no perfil, na equipe e na sala de batalha ao vivo — ou seja, é o campo mais visível da plataforma.

## Como funciona

Três camadas, porque nenhuma sozinha resolve:

| Camada | Pega o quê | Onde age |
|--------|-----------|----------|
| **Filtro automático** | palavrão óbvio e suas variações | cadastro, troca de nome, nome/descrição de equipe |
| **Fila de revisão** | casos ambíguos (`REVIEW`) | painel do professor |
| **Denúncia de aluno** | o que o filtro não pega (ironia, gíria nova, contexto) | painel do professor |

### Por que não bloquear tudo que parece suspeito

"Pinto" é sobrenome. "Cunha", "Assunção", "Cuiabá", "Conceição" contêm sequências que uma blocklist ingênua barraria. Bloquear esses nomes seria pior que o problema: impede aluno real de se cadastrar e ninguém entende o motivo.

Por isso há **dois níveis**:

- `BLOCK` — não deixa cadastrar. Casos inequívocos.
- `REVIEW` — **deixa passar** e manda para o professor olhar. Casos ambíguos.

Falso positivo vira trabalho de revisão, não porta fechada na cara do aluno.

## Contra evasão

O filtro normaliza antes de comparar:

| Tentativa | Vira | Resultado |
|-----------|------|-----------|
| `c4r4lh0` | leetspeak convertido | bloqueado |
| `CARAAAALHO` | letras repetidas colapsadas | bloqueado |
| `C U` / `f i l h o d a p u t a` | letras soltas remontadas | bloqueado |
| `bUcEtA` | caixa normalizada | bloqueado |
| `vi@do`, `seu.site.com` | links/símbolos | bloqueado |
| `João Silva`, `Ana Cunha`, `Carlos Cuiabá` | — | passa |
| `Matheus Pinto` | — | passa, marcado para revisão |

Regra de casamento por termo:

- `token` — só palavra inteira. Para termos curtos ou que também são sobrenome.
- `contains` — casa dentro da palavra. Só para termos longos, que não aparecem dentro de palavra legítima.

Há ainda uma **allowlist** de palavras comuns que contêm sequências bloqueadas.

Isso não impede alguém determinado a ofender com uma frase criativa. Impede o caso real: aluno testando limite no cadastro. O resto é denúncia + revisão.

## Onde o filtro é aplicado

| Fluxo | Rota |
|-------|------|
| Cadastro | `apps/web/app/api/auth/register/route.ts` (ver snippet) |
| Trocar nome | `PATCH /api/profile/name` |
| Criar equipe | `POST /api/teams` (nome e descrição) |
| Validação enquanto digita | `POST /api/moderation/check` |

## Painel do professor

Rota `/professor/moderacao` (só `TEACHER`):

- Fila de revisão com o valor tentado, categoria e termo que casou
- **Renomear** aluno cujo nome ofensivo já estava no banco antes do filtro
- **Arquivar** caso avaliado
- Adicionar/remover termos **sem deploy**

Renome forçado troca **apenas o nome exibido**. Conta, progresso, XP, gemas e inventário ficam intactos.

## Rotas novas

| Método | Rota | Quem |
|--------|------|------|
| POST | `/api/moderation/check` | qualquer usuário |
| PATCH | `/api/profile/name` | dono da conta |
| POST | `/api/moderation/report` | aluno (limite de 10/hora) |
| GET/POST/DELETE | `/api/moderation/terms` | professor |
| GET/PATCH | `/api/moderation/events` | professor |
| POST | `/api/moderation/rename` | professor |

## Aplicação

1. Colar `schema-moderation.snippet.prisma` no `schema.prisma`
2. Copiar a migration `20260819180000_add_moderation`
3. `pnpm db:migrate:deploy && pnpm --filter database generate`
4. Aplicar o snippet no `register/route.ts`
5. Adicionar `/professor/moderacao` na navegação do professor

A migration **só cria duas tabelas**. Nenhuma coluna de `users` é alterada.

## Ajustes depois

- Termos novos: pelo painel, sem deploy
- Se algum nome legítimo for barrado: mudar o termo para `REVIEW` ou incluir a palavra na `ALLOWLIST` em `content-moderation.ts`
