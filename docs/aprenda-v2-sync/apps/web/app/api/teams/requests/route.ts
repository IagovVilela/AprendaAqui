import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamPermission } from "@/lib/team-context";

export async function GET() {
  const result = await requireTeamPermission("members.approve");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const requests = await prisma.teamJoinRequest.findMany({
    where: { teamId: result.context.teamId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      createdAt: true,
      user: { select: { id: true, name: true, xpTotal: true } },
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const result = await requireTeamPermission("members.approve");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = (await request.json().catch(() => null)) as {
    requestId?: string;
    decision?: string;
  } | null;

  const requestId = body?.requestId?.trim();
  const decision = body?.decision;

  if (!requestId || (decision !== "ACCEPT" && decision !== "REJECT")) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const joinRequest = await prisma.teamJoinRequest.findUnique({
    where: { id: requestId },
    select: { id: true, teamId: true, userId: true, status: true },
  });

  if (!joinRequest || joinRequest.teamId !== result.context.teamId) {
    return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
  }

  if (joinRequest.status !== "PENDING") {
    return NextResponse.json({ error: "Solicitação já foi decidida" }, { status: 409 });
  }

  if (decision === "REJECT") {
    await prisma.teamJoinRequest.update({
      where: { id: joinRequest.id },
      data: {
        status: "REJECTED",
        decidedById: result.context.userId,
        decidedAt: new Date(),
      },
    });
    return NextResponse.json({ decided: "REJECTED" });
  }

  const team = await prisma.team.findUnique({
    where: { id: joinRequest.teamId },
    select: { maxMembers: true, _count: { select: { members: true } } },
  });

  if (!team) {
    return NextResponse.json({ error: "Equipe não encontrada" }, { status: 404 });
  }

  if (team._count.members >= team.maxMembers) {
    return NextResponse.json({ error: "A equipe está cheia" }, { status: 409 });
  }

  const alreadyInATeam = await prisma.teamMember.findUnique({
    where: { userId: joinRequest.userId },
    select: { id: true },
  });

  if (alreadyInATeam) {
    await prisma.teamJoinRequest.update({
      where: { id: joinRequest.id },
      data: {
        status: "CANCELLED",
        decidedById: result.context.userId,
        decidedAt: new Date(),
      },
    });
    return NextResponse.json(
      { error: "Este aluno já entrou em outra equipe" },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.create({
      data: { teamId: joinRequest.teamId, userId: joinRequest.userId, role: "MEMBER" },
    });
    await tx.teamJoinRequest.update({
      where: { id: joinRequest.id },
      data: {
        status: "ACCEPTED",
        decidedById: result.context.userId,
        decidedAt: new Date(),
      },
    });
  });

  return NextResponse.json({ decided: "ACCEPTED" });
}
