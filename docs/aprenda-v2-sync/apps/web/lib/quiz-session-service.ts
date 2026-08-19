import { drawQuestions, prisma } from "database";
import { generateInviteCode } from "@/lib/team-roles";

export const QUESTIONS_PER_SESSION = 10;

export type CreateSessionInput = {
  mode: "TEAM_INTERNAL" | "TEAM_WAR";
  hostUserId: string | null;
  teamId: string | null;
  warId: string | null;
  trackId: string | null;
  amount?: number;
};

export type CreatedSession = {
  id: string;
  code: string;
  questionCount: number;
};

async function generateUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateInviteCode(6);
    const taken = await prisma.quizSession.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!taken) return code;
  }
  throw new Error("Não foi possível gerar um código de sala");
}

export async function createQuizSession({
  mode,
  hostUserId,
  teamId,
  warId,
  trackId,
  amount = QUESTIONS_PER_SESSION,
}: CreateSessionInput): Promise<CreatedSession> {
  const questions = await drawQuestions(prisma, { trackId, amount });

  if (questions.length < 3) {
    throw new Error(
      "Banco de perguntas insuficiente para esta trilha. Rode a sincronização do banco de perguntas."
    );
  }

  const code = await generateUniqueCode();

  const session = await prisma.quizSession.create({
    data: {
      code,
      mode,
      hostUserId,
      teamId,
      warId,
      trackId,
      status: "LOBBY",
      questions: {
        create: questions.map((question, index) => ({
          questionId: question.id,
          order: index + 1,
          timeLimitSec: question.timeLimitSec,
        })),
      },
    },
    select: { id: true, code: true },
  });

  return { id: session.id, code: session.code, questionCount: questions.length };
}
