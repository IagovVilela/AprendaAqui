import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamPermission } from "@/lib/team-context";
import { createQuizSession } from "@/lib/quiz-session-service";

/** Desafio interno: admin/dono abre uma sala para os membros da própria equipe. */
export async function POST(request: Request) {
  const result = await requireTeamPermission("battle.startInternal");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = (await request.json().catch(() => null)) as { trackId?: string | null } | null;
  const trackId = body?.trackId?.trim() || null;

  if (trackId) {
    const track = await prisma.track.findUnique({ where: { id: trackId }, select: { id: true } });
    if (!track) {
      return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
    }
  }

  const active = await prisma.quizSession.findFirst({
    where: {
      teamId: result.context.teamId,
      status: { in: ["LOBBY", "QUESTION", "INTERMISSION"] },
    },
    select: { code: true },
  });

  if (active) {
    return NextResponse.json(
      { error: "Já existe um desafio em andamento", code: active.code },
      { status: 409 }
    );
  }

  try {
    const session = await createQuizSession({
      mode: "TEAM_INTERNAL",
      hostUserId: result.context.userId,
      teamId: result.context.teamId,
      warId: null,
      trackId,
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar a sala";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
