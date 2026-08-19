import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireSessionUserId } from "@/lib/team-context";

/**
 * Dois caminhos de entrada, decididos por equipe:
 * - código de convite: entra na hora
 * - solicitação: fica pendente até um admin aprovar (só em equipes REQUEST)
 */
export async function POST(request: Request) {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = (await request.json().catch(() => null)) as {
    code?: string;
    teamId?: string;
  } | null;

  const existingMembership = await prisma.teamMember.findUnique({
    where: { userId: auth.userId },
    select: { teamId: true },
  });

  if (existingMembership) {
    return NextResponse.json({ error: "Você já está em uma equipe" }, { status: 409 });
  }

  const code = body?.code?.trim().toUpperCase();

  if (code) {
    return joinWithInviteCode(auth.userId, code);
  }

  const teamId = body?.teamId?.trim();
  if (!teamId) {
    return NextResponse.json({ error: "Informe um código ou uma equipe" }, { status: 400 });
  }

  return requestToJoin(auth.userId, teamId);
}

async function joinWithInviteCode(userId: string, code: string) {
  const invite = await prisma.teamInvite.findUnique({
    where: { code },
    select: {
      id: true,
      teamId: true,
      uses: true,
      maxUses: true,
      expiresAt: true,
      revokedAt: true,
      team: { select: { maxMembers: true, _count: { select: { members: true } } } },
    },
  });

  if (!invite || invite.revokedAt) {
    return NextResponse.json({ error: "Código inválido" }, { status: 404 });
  }

  if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Código expirado" }, { status: 410 });
  }

  if (invite.maxUses !== null && invite.uses >= invite.maxUses) {
    return NextResponse.json({ error: "Código já foi usado o máximo de vezes" }, { status: 410 });
  }

  if (invite.team._count.members >= invite.team.maxMembers) {
    return NextResponse.json({ error: "A equipe está cheia" }, { status: 409 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.create({
      data: { teamId: invite.teamId, userId, role: "MEMBER" },
    });
    await tx.teamInvite.update({
      where: { id: invite.id },
      data: { uses: { increment: 1 } },
    });
    await tx.teamJoinRequest.updateMany({
      where: { userId, status: "PENDING" },
      data: { status: "CANCELLED", decidedAt: new Date() },
    });
  });

  return NextResponse.json({ joined: true, teamId: invite.teamId });
}

async function requestToJoin(userId: string, teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      joinPolicy: true,
      maxMembers: true,
      _count: { select: { members: true } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Equipe não encontrada" }, { status: 404 });
  }

  if (team.joinPolicy === "INVITE_ONLY") {
    return NextResponse.json(
      { error: "Esta equipe aceita apenas convites por código" },
      { status: 403 }
    );
  }

  if (team._count.members >= team.maxMembers) {
    return NextResponse.json({ error: "A equipe está cheia" }, { status: 409 });
  }

  const requested = await prisma.teamJoinRequest.upsert({
    where: { teamId_userId: { teamId, userId } },
    create: { teamId, userId, status: "PENDING" },
    update: { status: "PENDING", decidedAt: null, decidedById: null },
    select: { id: true, status: true },
  });

  return NextResponse.json({ requested: true, request: requested });
}
