import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamMembership } from "@/lib/team-context";
import { can, permissionsForRole } from "@/lib/team-roles";

export async function GET() {
  const result = await requireTeamMembership();
  if (!result.ok) {
    return NextResponse.json({ error: result.error, team: null }, { status: result.status });
  }

  const { teamId, role, userId } = result.context;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      emblemSeed: true,
      emblemColor: true,
      joinPolicy: true,
      maxMembers: true,
      xpTotal: true,
      warPoints: true,
      warsWon: true,
      warsLost: true,
      ownerId: true,
      members: {
        orderBy: [{ seasonPoints: "desc" }, { joinedAt: "asc" }],
        select: {
          id: true,
          role: true,
          seasonPoints: true,
          weekPoints: true,
          joinedAt: true,
          user: { select: { id: true, name: true, xpTotal: true, avatarConfig: true } },
        },
      },
      invites: {
        where: { revokedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { code: true, uses: true, maxUses: true, expiresAt: true },
      },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Equipe não encontrada", team: null }, { status: 404 });
  }

  const pendingRequests = can(role, "members.approve")
    ? await prisma.teamJoinRequest.findMany({
        where: { teamId, status: "PENDING" },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          createdAt: true,
          user: { select: { id: true, name: true, xpTotal: true } },
        },
      })
    : [];

  const wars = await prisma.teamWar.findMany({
    where: { OR: [{ challengerTeamId: teamId }, { opponentTeamId: teamId }] },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      status: true,
      prepEndsAt: true,
      minParticipants: true,
      challengerScore: true,
      opponentScore: true,
      winnerTeamId: true,
      createdAt: true,
      challengerTeam: { select: { id: true, name: true, emblemColor: true, emblemSeed: true } },
      opponentTeam: { select: { id: true, name: true, emblemColor: true, emblemSeed: true } },
      _count: { select: { participants: true } },
    },
  });

  return NextResponse.json({
    team: {
      ...team,
      inviteCode: team.invites[0]?.code ?? null,
    },
    viewer: {
      userId,
      role,
      permissions: permissionsForRole(role),
    },
    pendingRequests,
    wars,
  });
}
