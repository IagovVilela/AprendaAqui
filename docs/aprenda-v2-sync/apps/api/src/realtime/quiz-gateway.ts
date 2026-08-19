import type { Server, Socket } from "socket.io";
import type { PrismaClient } from "@prisma/client";
import { decode } from "next-auth/jwt";
import {
  aggregateTeamScore,
  applyShuffle,
  computePoints,
  displayIndexToRealIndex,
  resolveWar,
  seedFor,
  warPointsFor,
  type QuizDifficultyKey,
} from "database";

const INTERMISSION_MS = 5000;
const MAX_ANSWERS_PER_SESSION_PER_USER = 200;
const HEARTBEAT_MS = 15000;

type AuthedSocket = Socket & { data: { userId?: string; sessionCode?: string } };

type LoadedQuestion = {
  questionId: string;
  order: number;
  timeLimitSec: number;
  prompt: string;
  topic: string;
  options: string[];
  correctIndex: number;
  difficulty: QuizDifficultyKey;
};

type RoomRuntime = {
  code: string;
  sessionId: string;
  questions: LoadedQuestion[];
  timer: NodeJS.Timeout | null;
  answersByUser: Map<string, number>;
};

const rooms = new Map<string, RoomRuntime>();

function roomName(code: string): string {
  return `quiz:${code}`;
}

function parseOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((option): option is string => typeof option === "string");
}

async function loadRuntime(prisma: PrismaClient, code: string): Promise<RoomRuntime | null> {
  const cached = rooms.get(code);
  if (cached) return cached;

  const session = await prisma.quizSession.findUnique({
    where: { code },
    select: {
      id: true,
      questions: {
        orderBy: { order: "asc" },
        select: {
          order: true,
          timeLimitSec: true,
          question: {
            select: {
              id: true,
              prompt: true,
              topic: true,
              options: true,
              correctIndex: true,
              difficulty: true,
            },
          },
        },
      },
    },
  });

  if (!session) return null;

  const runtime: RoomRuntime = {
    code,
    sessionId: session.id,
    questions: session.questions.map((entry) => ({
      questionId: entry.question.id,
      order: entry.order,
      timeLimitSec: entry.timeLimitSec,
      prompt: entry.question.prompt,
      topic: entry.question.topic,
      options: parseOptions(entry.question.options),
      correctIndex: entry.question.correctIndex,
      difficulty: entry.question.difficulty as QuizDifficultyKey,
    })),
    timer: null,
    answersByUser: new Map(),
  };

  rooms.set(code, runtime);
  return runtime;
}

async function scoreboardFor(prisma: PrismaClient, sessionId: string) {
  const participants = await prisma.quizParticipant.findMany({
    where: { sessionId },
    orderBy: [{ score: "desc" }, { correctCount: "desc" }],
    select: {
      userId: true,
      teamId: true,
      score: true,
      correctCount: true,
      connected: true,
      user: { select: { name: true } },
    },
  });

  return participants.map((p, index) => ({
    position: index + 1,
    userId: p.userId,
    teamId: p.teamId,
    name: p.user.name,
    score: p.score,
    correctCount: p.correctCount,
    connected: p.connected,
  }));
}

export function createQuizGateway(io: Server, prisma: PrismaClient): void {
  const namespace = io.of("/quiz");

  namespace.use(async (socket, next) => {
    const token = (socket.handshake.auth as { token?: string } | undefined)?.token;
    const secret = process.env.NEXTAUTH_SECRET;

    if (!token || !secret) {
      next(new Error("unauthenticated"));
      return;
    }

    try {
      const payload = await decode({ token, secret });
      const userId = typeof payload?.id === "string" ? payload.id : null;

      if (!userId) {
        next(new Error("unauthenticated"));
        return;
      }

      (socket as AuthedSocket).data.userId = userId;
      next();
    } catch {
      next(new Error("unauthenticated"));
    }
  });

  namespace.on("connection", (rawSocket) => {
    const socket = rawSocket as AuthedSocket;

    socket.on("room:join", async ({ code }: { code?: string }) => {
      const userId = socket.data.userId;
      const normalized = code?.trim().toUpperCase();
      if (!userId || !normalized) return;

      const session = await prisma.quizSession.findUnique({
        where: { code: normalized },
        select: {
          id: true,
          mode: true,
          status: true,
          teamId: true,
          hostUserId: true,
          currentQuestionIndex: true,
          questionStartedAt: true,
          questionEndsAt: true,
          war: { select: { challengerTeamId: true, opponentTeamId: true } },
        },
      });

      if (!session || session.status === "FINISHED" || session.status === "CANCELLED") {
        socket.emit("room:error", { message: "Sala indisponível" });
        return;
      }

      const membership = await prisma.teamMember.findUnique({
        where: { userId },
        select: { teamId: true },
      });

      const allowedTeamIds = session.war
        ? [session.war.challengerTeamId, session.war.opponentTeamId]
        : [session.teamId];

      if (!membership || !allowedTeamIds.includes(membership.teamId)) {
        socket.emit("room:error", { message: "Esta sala é de outra equipe" });
        return;
      }

      // Rejoin: se já existe participante, a pontuação é retomada em vez de recriada.
      const participant = await prisma.quizParticipant.upsert({
        where: { sessionId_userId: { sessionId: session.id, userId } },
        create: {
          sessionId: session.id,
          userId,
          teamId: membership.teamId,
          optionSeed: Math.floor(Math.random() * 2_000_000_000) + 1,
        },
        update: { connected: true, lastSeenAt: new Date() },
        select: { id: true, score: true, optionSeed: true, answeredCount: true },
      });

      socket.data.sessionCode = normalized;
      await socket.join(roomName(normalized));

      const runtime = await loadRuntime(prisma, normalized);
      if (!runtime) return;

      socket.emit("room:state", {
        code: normalized,
        mode: session.mode,
        status: session.status,
        isHost: session.hostUserId === userId,
        questionCount: runtime.questions.length,
        currentQuestionIndex: session.currentQuestionIndex,
        myScore: participant.score,
        scoreboard: await scoreboardFor(prisma, session.id),
      });

      if (session.status === "QUESTION" && session.questionEndsAt) {
        const current = runtime.questions[session.currentQuestionIndex - 1];
        if (current) {
          const answered = await prisma.quizAnswer.findUnique({
            where: {
              participantId_questionId: {
                participantId: participant.id,
                questionId: current.questionId,
              },
            },
            select: { id: true },
          });

          socket.emit("question:start", {
            index: current.order,
            total: runtime.questions.length,
            topic: current.topic,
            prompt: current.prompt,
            options: applyShuffle(
              current.options,
              seedFor(participant.optionSeed, current.questionId)
            ),
            endsAt: session.questionEndsAt.toISOString(),
            alreadyAnswered: answered !== null,
          });
        }
      }

      namespace.to(roomName(normalized)).emit("scoreboard", {
        scoreboard: await scoreboardFor(prisma, session.id),
      });
    });

    socket.on("host:next", async () => {
      const userId = socket.data.userId;
      const code = socket.data.sessionCode;
      if (!userId || !code) return;

      const session = await prisma.quizSession.findUnique({
        where: { code },
        select: { id: true, hostUserId: true, status: true, currentQuestionIndex: true },
      });

      if (!session || session.hostUserId !== userId) return;
      if (session.status === "QUESTION") return;

      await startNextQuestion(namespace, prisma, code);
    });

    socket.on(
      "answer:submit",
      async ({ displayIndex }: { displayIndex?: number }) => {
        const userId = socket.data.userId;
        const code = socket.data.sessionCode;
        if (!userId || !code || typeof displayIndex !== "number") return;

        const runtime = await loadRuntime(prisma, code);
        if (!runtime) return;

        const submissions = runtime.answersByUser.get(userId) ?? 0;
        if (submissions >= MAX_ANSWERS_PER_SESSION_PER_USER) return;
        runtime.answersByUser.set(userId, submissions + 1);

        const session = await prisma.quizSession.findUnique({
          where: { code },
          select: {
            id: true,
            status: true,
            currentQuestionIndex: true,
            questionStartedAt: true,
            questionEndsAt: true,
          },
        });

        if (
          !session ||
          session.status !== "QUESTION" ||
          !session.questionStartedAt ||
          !session.questionEndsAt
        ) {
          return;
        }

        // Janela autoritativa do servidor: o cliente não informa tempo.
        const now = Date.now();
        if (now > session.questionEndsAt.getTime()) {
          socket.emit("answer:rejected", { reason: "tempo esgotado" });
          return;
        }

        const current = runtime.questions[session.currentQuestionIndex - 1];
        if (!current) return;

        const participant = await prisma.quizParticipant.findUnique({
          where: { sessionId_userId: { sessionId: session.id, userId } },
          select: { id: true, optionSeed: true },
        });

        if (!participant) return;

        const realIndex = displayIndexToRealIndex(
          displayIndex,
          current.options.length,
          seedFor(participant.optionSeed, current.questionId)
        );

        if (realIndex === null) return;

        const responseMs = now - session.questionStartedAt.getTime();
        const correct = realIndex === current.correctIndex;
        const points = computePoints({
          correct,
          responseMs,
          timeLimitSec: current.timeLimitSec,
          difficulty: current.difficulty,
        });

        try {
          await prisma.$transaction(async (tx) => {
            await tx.quizAnswer.create({
              data: {
                sessionId: session.id,
                participantId: participant.id,
                questionId: current.questionId,
                selectedIndex: realIndex,
                correct,
                responseMs,
                points,
              },
            });

            await tx.quizParticipant.update({
              where: { id: participant.id },
              data: {
                score: { increment: points },
                correctCount: { increment: correct ? 1 : 0 },
                answeredCount: { increment: 1 },
                lastSeenAt: new Date(),
              },
            });
          });
        } catch {
          // UNIQUE (participant, question): segunda resposta é ignorada.
          socket.emit("answer:rejected", { reason: "você já respondeu" });
          return;
        }

        socket.emit("answer:accepted", { points, correct });
      }
    );

    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      const code = socket.data.sessionCode;
      if (!userId || !code) return;

      const session = await prisma.quizSession.findUnique({
        where: { code },
        select: { id: true },
      });

      if (!session) return;

      await prisma.quizParticipant.updateMany({
        where: { sessionId: session.id, userId },
        data: { connected: false, lastSeenAt: new Date() },
      });

      namespace.to(roomName(code)).emit("scoreboard", {
        scoreboard: await scoreboardFor(prisma, session.id),
      });
    });
  });

  setInterval(() => {
    for (const runtime of rooms.values()) {
      namespace.to(roomName(runtime.code)).emit("heartbeat", { at: Date.now() });
    }
  }, HEARTBEAT_MS);
}

async function startNextQuestion(
  namespace: ReturnType<Server["of"]>,
  prisma: PrismaClient,
  code: string
): Promise<void> {
  const runtime = await loadRuntime(prisma, code);
  if (!runtime) return;

  const session = await prisma.quizSession.findUnique({
    where: { code },
    select: { id: true, currentQuestionIndex: true },
  });

  if (!session) return;

  const nextIndex = session.currentQuestionIndex + 1;
  const question = runtime.questions[nextIndex - 1];

  if (!question) {
    await finishSession(namespace, prisma, code);
    return;
  }

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + question.timeLimitSec * 1000);

  await prisma.quizSession.update({
    where: { id: session.id },
    data: {
      status: "QUESTION",
      currentQuestionIndex: nextIndex,
      questionStartedAt: startedAt,
      questionEndsAt: endsAt,
    },
  });

  const participants = await prisma.quizParticipant.findMany({
    where: { sessionId: session.id },
    select: { userId: true, optionSeed: true },
  });

  const seedByUser = new Map(participants.map((p) => [p.userId, p.optionSeed]));
  const sockets = await namespace.in(roomName(code)).fetchSockets();

  // Cada participante recebe as alternativas em ordem própria, no seu próprio socket.
  for (const target of sockets) {
    const targetUserId = (target.data as { userId?: string }).userId;
    const optionSeed = targetUserId ? seedByUser.get(targetUserId) : undefined;
    if (optionSeed === undefined) continue;

    target.emit("question:start", {
      index: nextIndex,
      total: runtime.questions.length,
      topic: question.topic,
      prompt: question.prompt,
      options: applyShuffle(question.options, seedFor(optionSeed, question.questionId)),
      endsAt: endsAt.toISOString(),
      alreadyAnswered: false,
    });
  }

  if (runtime.timer) clearTimeout(runtime.timer);
  runtime.timer = setTimeout(() => {
    void endQuestion(namespace, prisma, code);
  }, question.timeLimitSec * 1000 + 250);
}

async function endQuestion(
  namespace: ReturnType<Server["of"]>,
  prisma: PrismaClient,
  code: string
): Promise<void> {
  const runtime = await loadRuntime(prisma, code);
  if (!runtime) return;

  const session = await prisma.quizSession.findUnique({
    where: { code },
    select: { id: true, currentQuestionIndex: true },
  });

  if (!session) return;

  const question = runtime.questions[session.currentQuestionIndex - 1];
  if (!question) return;

  await prisma.quizSession.update({
    where: { id: session.id },
    data: { status: "INTERMISSION", questionStartedAt: null, questionEndsAt: null },
  });

  namespace.to(roomName(code)).emit("question:end", {
    index: question.order,
    correctOption: question.options[question.correctIndex],
    scoreboard: await scoreboardFor(prisma, session.id),
  });

  const isLast = session.currentQuestionIndex >= runtime.questions.length;

  if (runtime.timer) clearTimeout(runtime.timer);
  runtime.timer = setTimeout(() => {
    if (isLast) {
      void finishSession(namespace, prisma, code);
    } else {
      void startNextQuestion(namespace, prisma, code);
    }
  }, INTERMISSION_MS);
}

async function finishSession(
  namespace: ReturnType<Server["of"]>,
  prisma: PrismaClient,
  code: string
): Promise<void> {
  const session = await prisma.quizSession.findUnique({
    where: { code },
    select: {
      id: true,
      mode: true,
      teamId: true,
      warId: true,
      war: {
        select: {
          id: true,
          challengerTeamId: true,
          opponentTeamId: true,
          minParticipants: true,
          status: true,
        },
      },
    },
  });

  if (!session) return;

  const participants = await prisma.quizParticipant.findMany({
    where: { sessionId: session.id },
    select: { id: true, userId: true, teamId: true, score: true },
  });

  await prisma.quizSession.update({
    where: { id: session.id },
    data: { status: "FINISHED", finishedAt: new Date() },
  });

  if (session.mode === "TEAM_INTERNAL" && session.teamId) {
    for (const participant of participants) {
      await prisma.teamMember.updateMany({
        where: { teamId: session.teamId, userId: participant.userId },
        data: {
          seasonPoints: { increment: participant.score },
          weekPoints: { increment: participant.score },
        },
      });
    }
  }

  let warResult: {
    challengerScore: number;
    opponentScore: number;
    winnerTeamId: string | null;
    draw: boolean;
  } | null = null;

  if (session.mode === "TEAM_WAR" && session.war) {
    const war = session.war;

    const challenger = aggregateTeamScore({
      scores: participants.filter((p) => p.teamId === war.challengerTeamId).map((p) => p.score),
      minParticipants: war.minParticipants,
    });
    const opponent = aggregateTeamScore({
      scores: participants.filter((p) => p.teamId === war.opponentTeamId).map((p) => p.score),
      minParticipants: war.minParticipants,
    });

    const outcome = resolveWar(
      war.challengerTeamId,
      challenger.average,
      war.opponentTeamId,
      opponent.average
    );

    warResult = {
      challengerScore: challenger.average,
      opponentScore: opponent.average,
      winnerTeamId: outcome.winnerTeamId,
      draw: outcome.draw,
    };

    await prisma.$transaction(async (tx) => {
      await tx.teamWar.update({
        where: { id: war.id },
        data: {
          status: "FINISHED",
          finishedAt: new Date(),
          challengerScore: challenger.average,
          opponentScore: opponent.average,
          winnerTeamId: outcome.winnerTeamId,
        },
      });

      for (const participant of participants) {
        await tx.teamWarParticipant.updateMany({
          where: { warId: war.id, userId: participant.userId },
          data: { score: participant.score },
        });
        if (participant.teamId) {
          await tx.teamMember.updateMany({
            where: { teamId: participant.teamId, userId: participant.userId },
            data: {
              seasonPoints: { increment: participant.score },
              weekPoints: { increment: participant.score },
            },
          });
        }
      }

      for (const teamId of [war.challengerTeamId, war.opponentTeamId]) {
        const result = outcome.draw ? "DRAW" : outcome.winnerTeamId === teamId ? "WIN" : "LOSS";
        await tx.team.update({
          where: { id: teamId },
          data: {
            warPoints: { increment: warPointsFor(result) },
            warsWon: { increment: result === "WIN" ? 1 : 0 },
            warsLost: { increment: result === "LOSS" ? 1 : 0 },
          },
        });
      }
    });
  }

  namespace.to(roomName(code)).emit("session:finished", {
    scoreboard: await scoreboardFor(prisma, session.id),
    war: warResult,
  });

  const runtime = rooms.get(code);
  if (runtime?.timer) clearTimeout(runtime.timer);
  rooms.delete(code);
}
