import type { PrismaClient } from "@prisma/client";
import type { QuizDifficultyKey } from "./quiz-scoring";

export type ImportedQuestion = {
  lessonId: string;
  trackId: string | null;
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: QuizDifficultyKey;
};

type LessonQuizContent = {
  questions?: {
    question?: unknown;
    options?: unknown;
    correctIndex?: unknown;
  }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function difficultyFromXp(xpReward: number): QuizDifficultyKey {
  if (xpReward >= 20) return "HARD";
  if (xpReward >= 15) return "MEDIUM";
  return "EASY";
}

/**
 * O banco de perguntas vem do conteúdo já ensinado na plataforma:
 * cada lição do tipo QUIZ vira uma ou mais perguntas de batalha.
 */
export function extractQuestionsFromLesson(lesson: {
  id: string;
  trackId: string | null;
  title: string;
  xpReward: number;
  content: unknown;
}): ImportedQuestion[] {
  if (!isRecord(lesson.content)) return [];

  const content = lesson.content as LessonQuizContent;
  if (!Array.isArray(content.questions)) return [];

  const result: ImportedQuestion[] = [];

  for (const raw of content.questions) {
    if (!isRecord(raw)) continue;

    const prompt = typeof raw.question === "string" ? raw.question.trim() : "";
    const options = Array.isArray(raw.options)
      ? raw.options.filter((option): option is string => typeof option === "string")
      : [];
    const correctIndex = typeof raw.correctIndex === "number" ? raw.correctIndex : -1;

    if (prompt.length === 0) continue;
    if (options.length < 2) continue;
    if (correctIndex < 0 || correctIndex >= options.length) continue;

    result.push({
      lessonId: lesson.id,
      trackId: lesson.trackId,
      topic: lesson.title,
      prompt,
      options,
      correctIndex,
      difficulty: difficultyFromXp(lesson.xpReward),
    });
  }

  return result;
}

export type SyncResult = {
  created: number;
  skipped: number;
};

/**
 * Aditivo e idempotente: cria perguntas que ainda não existem e não altera
 * nem remove nada do banco de perguntas ou das lições.
 */
export async function syncQuestionBankFromLessons(prisma: PrismaClient): Promise<SyncResult> {
  const lessons = await prisma.lesson.findMany({
    where: { type: "QUIZ" },
    select: { id: true, trackId: true, title: true, xpReward: true, content: true },
  });

  let created = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    for (const question of extractQuestionsFromLesson(lesson)) {
      const existing = await prisma.quizQuestion.findFirst({
        where: { lessonId: question.lessonId, prompt: question.prompt },
        select: { id: true },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      await prisma.quizQuestion.create({
        data: {
          lessonId: question.lessonId,
          trackId: question.trackId,
          topic: question.topic,
          prompt: question.prompt,
          options: question.options,
          correctIndex: question.correctIndex,
          difficulty: question.difficulty,
          source: "LESSON",
        },
      });
      created += 1;
    }
  }

  return { created, skipped };
}

export type DrawOptions = {
  trackId?: string | null;
  amount: number;
};

/** Sorteio simples: pega perguntas ativas da trilha escolhida (ou de todas, no modo misto). */
export async function drawQuestions(
  prisma: PrismaClient,
  { trackId, amount }: DrawOptions
): Promise<{ id: string; timeLimitSec: number }[]> {
  const pool = await prisma.quizQuestion.findMany({
    where: {
      active: true,
      ...(trackId ? { trackId } : {}),
    },
    select: { id: true, timeLimitSec: true },
  });

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  return pool.slice(0, amount);
}
