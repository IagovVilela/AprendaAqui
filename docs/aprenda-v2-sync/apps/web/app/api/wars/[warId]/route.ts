import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamMembership } from "@/lib/team-context";
import { can } from "@/lib/team-roles";
import { createQuizSession } from "@/lib/quiz-session-service";
import { evaluateWarReadiness, isPreparationOpen } from "@/lib/war-phases";

type WarAction = "CONFIRM" | "WITHDRAW" | "START" | "CANCEL";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ warId: string }> }
) {
  const { warId } = await params;

  const war = await prisma.teamWar.findUnique({
    where: { id: warId },
    select: {
      id: true,
      status: true,
      trackId: true,
      minParticipants: true,
      prepEndsAt: true,
      battleStartedAt: true,
      challengerScore: true,
      opponentScore: true,
      winnerTeamId: true,
      finishedAt: true,
      challengerTeam: { select: { id: true, name: true, emblemColor: true, emblemSeed: true } },
      opponentTeam: { select: { id: true, name: true, emblemColor: true, emblemSeed: true } },
      quizSession: { select: { code: true, status: true } },
      participants: {
        select: {
          teamId: true,
          userId: true,
          score: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!war) {
    return NextResponse.json({ error: "Guerra não encontrada" }, { status: 404 });
  }

  const challengerConfirmed = war.participants.filter(
    (p) => p.teamId === war.challengerTeam.id
  ).length;
  const opponentConfirmed = war.participants.filter(
    (p) => p.teamId === war.opponentTeam.id
  ).length;

  return NextResponse.json({
    war,
    readiness: evaluateWarReadiness(
      challengerConfirmed,
      opponentConfirmed,
      war.minParticipants
    ),
    preparationOpen: isPreparationOpen(war.prepEndsAt),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ warId: string }> }
) {
  const result = await requireTeamMembership();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { warId } = await params;
  const body = (await request.json().catch(() => null)) as { action?: WarAction } | null;
  const action = body?.action;

  const war = await prisma.teamWar.findUnique({
    where: { id: warId },
    select: {
      id: true,
      status: true,
      trackId: true,
      minParticipants: true,
      prepEndsAt: true,
      challengerTeamId: true,
      opponentTeamId: true,
    },
  });

  if (!war) {
    return NextResponse.json({ error: "Guerra não encontrada" }, { status: 404 });
  }

  const { teamId, userId, role } = result.context;

  if (teamId !== war.challengerTeamId && teamId !== war.opponentTeamId) {
    return NextResponse.json({ error: "Sua equipe não está nesta guerra" }, { status: 403 });
  }

  switch (action) {
    case "CONFIRM": {
      if (war.status !== "PREPARATION" || !isPreparationOpen(war.prepEndsAt)) {
        return NextResponse.json({ error: "A preparação foi encerrada" }, { status: 409 });
      }

      await prisma.teamWarParticipant.upsert({
        where: { warId_userId: { warId: war.id, userId } },
        create: { warId: war.id, teamId, userId },
        update: { teamId },
      });

      return NextResponse.json({ confirmed: true });
    }

    case "WITHDRAW": {
      if (war.status !== "PREPARATION") {
        return NextResponse.json({ error: "A preparação foi encerrada" }, { status: 409 });
      }

      await prisma.teamWarParticipant.deleteMany({ where: { warId: war.id, userId } });
      return NextResponse.json({ confirmed: false });
    }

    case "START": {
      if (!can(role, "war.declare")) {
        return NextResponse.json({ error: "Apenas dono/admin inicia a batalha" }, { status: 403 });
      }

      if (war.status !== "PREPARATION") {
        return NextResponse.json({ error: "Esta guerra não está em preparação" }, { status: 409 });
      }

      const participants = await prisma.teamWarParticipant.findMany({
        where: { warId: war.id },
        select: { teamId: true },
      });

      const readiness = evaluateWarReadiness(
        participants.filter((p) => p.teamId === war.challengerTeamId).length,
        participants.filter((p) => p.teamId === war.opponentTeamId).length,
        war.minParticipants
      );

      if (!readiness.ready) {
        return NextResponse.json({ error: readiness.blockedReason, readiness }, { status: 409 });
      }

      try {
        const session = await createQuizSession({
          mode: "TEAM_WAR",
          hostUserId: userId,
          teamId: null,
          warId: war.id,
          trackId: war.trackId,
        });

        await prisma.teamWar.update({
          where: { id: war.id },
          data: { status: "BATTLE", battleStartedAt: new Date() },
        });

        return NextResponse.json({ started: true, code: session.code });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao criar a sala";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    case "CANCEL": {
      if (!can(role, "war.cancel")) {
        return NextResponse.json({ error: "Apenas dono/admin cancela" }, { status: 403 });
      }

      if (war.status !== "PREPARATION") {
        return NextResponse.json(
          { error: "Só é possível cancelar durante a preparação" },
          { status: 409 }
        );
      }

      await prisma.teamWar.update({
        where: { id: war.id },
        data: { status: "CANCELLED", finishedAt: new Date() },
      });

      return NextResponse.json({ cancelled: true });
    }

    default:
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
}
