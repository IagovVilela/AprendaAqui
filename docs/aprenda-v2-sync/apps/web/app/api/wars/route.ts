import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamPermission } from "@/lib/team-context";
import { MIN_TEAM_MEMBERS_TO_CREATE_WAR, MIN_WAR_PARTICIPANTS } from "@/lib/team-roles";
import { prepEndsAtFrom } from "@/lib/war-phases";

export async function GET() {
  const wars = await prisma.teamWar.findMany({
    where: { status: { in: ["PREPARATION", "BATTLE"] } },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      status: true,
      prepEndsAt: true,
      minParticipants: true,
      challengerTeam: { select: { id: true, name: true, emblemColor: true } },
      opponentTeam: { select: { id: true, name: true, emblemColor: true } },
      _count: { select: { participants: true } },
    },
  });

  return NextResponse.json({ wars });
}

/** Declarar guerra: abre a janela de preparação de 24h. */
export async function POST(request: Request) {
  const result = await requireTeamPermission("war.declare");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = (await request.json().catch(() => null)) as {
    opponentTeamId?: string;
    trackId?: string | null;
  } | null;

  const opponentTeamId = body?.opponentTeamId?.trim();
  const trackId = body?.trackId?.trim() || null;
  const { teamId, userId } = result.context;

  if (!opponentTeamId || opponentTeamId === teamId) {
    return NextResponse.json({ error: "Escolha outra equipe" }, { status: 400 });
  }

  const [challengerCount, opponent] = await Promise.all([
    prisma.teamMember.count({ where: { teamId } }),
    prisma.team.findUnique({
      where: { id: opponentTeamId },
      select: { id: true, name: true, _count: { select: { members: true } } },
    }),
  ]);

  if (!opponent) {
    return NextResponse.json({ error: "Equipe adversária não encontrada" }, { status: 404 });
  }

  if (challengerCount < MIN_TEAM_MEMBERS_TO_CREATE_WAR) {
    return NextResponse.json(
      { error: `Sua equipe precisa de ao menos ${MIN_TEAM_MEMBERS_TO_CREATE_WAR} membros` },
      { status: 409 }
    );
  }

  if (opponent._count.members < MIN_TEAM_MEMBERS_TO_CREATE_WAR) {
    return NextResponse.json(
      { error: "A equipe adversária ainda tem membros insuficientes" },
      { status: 409 }
    );
  }

  const ongoing = await prisma.teamWar.findFirst({
    where: {
      status: { in: ["PREPARATION", "BATTLE"] },
      OR: [
        { challengerTeamId: teamId },
        { opponentTeamId: teamId },
        { challengerTeamId: opponentTeamId },
        { opponentTeamId: opponentTeamId },
      ],
    },
    select: { id: true },
  });

  if (ongoing) {
    return NextResponse.json(
      { error: "Uma das equipes já está em uma guerra em andamento" },
      { status: 409 }
    );
  }

  if (trackId) {
    const track = await prisma.track.findUnique({ where: { id: trackId }, select: { id: true } });
    if (!track) {
      return NextResponse.json({ error: "Trilha não encontrada" }, { status: 404 });
    }
  }

  const war = await prisma.teamWar.create({
    data: {
      challengerTeamId: teamId,
      opponentTeamId: opponentTeamId,
      createdById: userId,
      trackId,
      minParticipants: MIN_WAR_PARTICIPANTS,
      prepEndsAt: prepEndsAtFrom(new Date()),
      status: "PREPARATION",
    },
    select: { id: true, prepEndsAt: true, minParticipants: true },
  });

  return NextResponse.json({ war }, { status: 201 });
}
