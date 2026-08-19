import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireSessionUserId } from "@/lib/team-context";

/**
 * Estado inicial da sala para renderizar a tela antes do WebSocket conectar.
 * Nunca devolve o índice correto de uma pergunta em andamento.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { code } = await params;

  const session = await prisma.quizSession.findUnique({
    where: { code: code.toUpperCase() },
    select: {
      id: true,
      code: true,
      mode: true,
      status: true,
      hostUserId: true,
      teamId: true,
      warId: true,
      currentQuestionIndex: true,
      questionEndsAt: true,
      _count: { select: { questions: true } },
      participants: {
        orderBy: { score: "desc" },
        select: {
          userId: true,
          teamId: true,
          score: true,
          correctCount: true,
          connected: true,
          user: { select: { name: true } },
        },
      },
      war: {
        select: {
          id: true,
          challengerTeamId: true,
          opponentTeamId: true,
          minParticipants: true,
          challengerTeam: { select: { name: true, emblemColor: true } },
          opponentTeam: { select: { name: true, emblemColor: true } },
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
  }

  const isParticipant = session.participants.some((p) => p.userId === auth.userId);
  const membership = await prisma.teamMember.findUnique({
    where: { userId: auth.userId },
    select: { teamId: true },
  });

  const allowedTeamIds = session.war
    ? [session.war.challengerTeamId, session.war.opponentTeamId]
    : [session.teamId];

  const canJoin = membership !== null && allowedTeamIds.includes(membership.teamId);

  if (!isParticipant && !canJoin) {
    return NextResponse.json({ error: "Esta sala é de outra equipe" }, { status: 403 });
  }

  return NextResponse.json({
    session: {
      id: session.id,
      code: session.code,
      mode: session.mode,
      status: session.status,
      isHost: session.hostUserId === auth.userId,
      questionCount: session._count.questions,
      currentQuestionIndex: session.currentQuestionIndex,
      questionEndsAt: session.questionEndsAt,
      war: session.war,
      participants: session.participants.map((p) => ({
        userId: p.userId,
        teamId: p.teamId,
        name: p.user.name,
        score: p.score,
        correctCount: p.correctCount,
        connected: p.connected,
      })),
    },
  });
}
