# Equipes, guerras e quiz ao vivo

Feature **nova**. Não altera nem remove nada do que já existe: trilhas, lições, gemas, inventário, avatar, ranking individual e progresso continuam iguais. Tudo entra em tabelas novas + rotas novas.

## Por que cada referência

### Clash Royale / Clash of Clans — o que realmente importa

O que faz clã funcionar não é o "clã" em si, é a **assimetria de poder** e o **ritmo**:

- **Hierarquia** existe para resolver conflito de gestão (quem aceita, quem expulsa). Sem papéis, equipe de 25 pessoas trava em discussão.
- **Guerra tem fases** porque o jogador precisa de uma janela para se comprometer *antes* de valer ponto. A fase de preparação é um mecanismo de compromisso, não enfeite.
- **Mínimo de participantes** existe porque, sem ele, uma equipe de 2 pessoas farma vitórias contra equipes desfalcadas.

O que **não** faz sentido copiar: deck building, tropas, doação de cartas. Aqui o "deck" é o que o aluno estudou.

### Kahoot — o que realmente importa

- **Pontuação por velocidade** transforma conhecimento em urgência. Só acerto/erro deixa o quiz morno.
- **Placar entre perguntas** cria a virada emocional. Placar só no fim mata a tensão.
- **Team mode usa média, não soma.** Isso é decisivo aqui (ver decisão 2).
- **Rejoin** existe porque conexão de aluno cai. Sem rejoin, uma queda elimina o aluno e desequilibra a equipe.

### Nosso diferencial

Banco de perguntas **derivado das trilhas do Aprenda Aqui**. A guerra cobra lógica de programação, HTML, Python — o que o aluno viu na plataforma. Não é trivia.

---

## Decisões (os pontos que a especificação deixou abertos)

### 1. Entrada na equipe: código de convite **e** solicitação

Não é ou/ou. Cada equipe escolhe via `joinPolicy`:

| Política | Como entra |
|----------|------------|
| `INVITE_ONLY` | só com código de convite |
| `REQUEST` | qualquer um pede; admin/dono aprova. Código continua valendo |

Motivo: turma fechada de escola quer `INVITE_ONLY`; equipe aberta quer crescer sozinha. Um modelo só atenderia metade dos casos.

### 2. Placar da equipe: **média** dos participantes que responderam

Média, com **piso de participantes** (`minParticipants`).

Se fosse soma, a equipe com mais gente ativa ganharia sem ser melhor. Se fosse média sem piso, uma equipe mandaria só o melhor aluno e ganharia com 1 pessoa. Média + piso resolve os dois abusos ao mesmo tempo — é exatamente por isso que o Kahoot usa média no team mode e o Clash exige mínimo para guerra.

### 3. Limite de membros: **25** (`MAX_TEAM_MEMBERS`)

Acima disso a página de equipe fica ilegível e o ranking interno perde graça. Constante única, fácil de ajustar.

### 4. Mínimo para declarar guerra: **5 elegíveis** (`MIN_WAR_PARTICIPANTS`)

Elegível = membro que **confirmou presença** na fase de preparação.

### 5. Fase de preparação: **24h**, tema escolhido pelo desafiante

O tema é uma trilha já existente (ou "misto"). A equipe desafiada vê o tema antes da batalha — informação simétrica, dá para estudar. Isso é pedagogicamente melhor que surpresa.

### 6. Um usuário, uma equipe

Restrição no banco: `team_members.user_id` é **UNIQUE**. Não depende de checagem na aplicação.

### 7. Emblema sem upload

`emblemSeed` + `emblemColor` geram um emblema determinístico em SVG. Zero storage, zero moderação de imagem. Upload fica para depois.

---

## Arquitetura

```
Equipe (Team)
 ├── TeamMember (papel: OWNER | ADMIN | MEMBER)
 ├── TeamInvite (código)
 ├── TeamJoinRequest (fila de aprovação)
 └── TeamWar (challenger vs opponent)
      └── TeamWarParticipant (confirmação + pontuação)

QuizSession  ← motor único, reutilizado
 ├── QuizSessionQuestion (perguntas sorteadas da trilha)
 ├── QuizParticipant (score, rejoin, seed de embaralhamento)
 └── QuizAnswer (uma por participante por pergunta)
```

`QuizSession.mode` decide quem consome o motor:

| Modo | Usado por |
|------|-----------|
| `TEAM_INTERNAL` | desafio interno (pilar 2) |
| `TEAM_WAR` | guerra entre equipes (pilar 3) |

Mesmo motor, mesma pontuação, mesmo rejoin. Só a agregação final difere: interno rankeia indivíduos, guerra tira média por equipe.

---

## Pontuação

```
pontos = base × (0.5 + 0.5 × tempoRestante / tempoLimite)
```

- Acerto sempre vale **no mínimo 50%** da base (piso do enunciado).
- Erro vale **0**.
- `base` vem da dificuldade: fácil 600, médio 800, difícil 1000.
- Fora da janela do servidor → resposta **inválida**, 0 ponto.

O tempo é medido **no servidor** (`questionStartedAt`). O cliente nunca informa quanto demorou.

---

## Anti-fraude do MVP

| Medida | Como |
|--------|------|
| Alternativas embaralhadas por participante | `QuizParticipant.optionSeed` — permutação determinística por participante/pergunta |
| Janela autoritativa | servidor compara com `questionStartedAt`/`questionEndsAt`; timestamp do cliente é ignorado |
| Uma resposta por pergunta | UNIQUE `(participant_id, question_id)` no banco |
| Rate limit | máximo de submissões por sessão por participante no gateway |
| Índice real oculto | o cliente recebe as alternativas já permutadas e responde pelo índice **exibido**; o servidor traduz |

Não resolve bot determinado — resolve script trivial, que é o ataque real em sala de aula.

---

## Tempo real

Socket.io no serviço **api** (que já existe no Railway), namespace `/quiz`.

Eventos servidor → cliente:

| Evento | Quando |
|--------|--------|
| `room:state` | ao entrar/reentrar (rejoin retoma pontuação) |
| `question:start` | pergunta + alternativas embaralhadas + `endsAt` |
| `question:end` | índice correto + placar |
| `scoreboard` | entre perguntas |
| `session:finished` | resultado final e, na guerra, vencedor |

Cliente → servidor: `room:join`, `answer:submit`, `host:next` (só dono/admin).

Estado da sala é **persistido no MySQL**, não só em memória: se o processo cair, a sala é reconstruída. Memória é cache.

---

## Integridade dos dados

- Migration **só cria tabelas novas**. Nenhum `DROP`, nenhuma coluna existente alterada.
- Nenhum `deleteMany`. Seed continua aditivo.
- Reset de temporada **não apaga histórico**: zera `seasonPoints` e grava snapshot.

Ver [DATA-INTEGRITY.md](./DATA-INTEGRITY.md).

---

## Escopo entregue neste patch

Pronto:

- Schema + migration aditiva
- Domínio: papéis/permissões, pontuação, fases da guerra, banco de perguntas a partir das trilhas
- APIs de equipe: criar, entrar por código, solicitar, aprovar, papéis, sair, transferir posse
- APIs de guerra: desafiar, confirmar presença, iniciar batalha, resultado
- Gateway Socket.io com rejoin, embaralhamento e janela autoritativa
- UI: lista de equipes, página da equipe, sala de quiz ao vivo

Fora do MVP:

- Matchmaking automático (só desafio direto por enquanto)
- Upload de emblema
- Liga com divisões (há ranking por pontos de guerra, sem promoção/rebaixamento)
