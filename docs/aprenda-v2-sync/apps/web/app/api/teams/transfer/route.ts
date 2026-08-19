import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamPermission } from "@/lib/team-context";

export async function POST(request: Request) {
  const result = await requireTeamPermission("team.transferOwnership");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = (await request.json().catch(() => null)) as { userId?: string } | null;
  const targetUserId = body?.userId?.trim();

  if (!targetUserId || targetUserId === result.context.userId) {
    return NextResponse.json({ error: "Escolha outro membro da equipe" }, { status: 400 });
  }

  const { teamId, userId } = result.context;

  const target = await prisma.teamMember.findUnique({
    where: { userId: targetUserId },
    select: { id: true, teamId: true },
  });

  if (!target || target.teamId !== teamId) {
    return NextResponse.json({ error: "Membro não encontrado na sua equipe" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.update({ where: { id: target.id }, data: { role: "OWNER" } });
    await tx.teamMember.update({ where: { userId }, data: { role: "ADMIN" } });
    await tx.team.update({ where: { id: teamId }, data: { ownerId: targetUserId } });
  });

  return NextResponse.json({ ownerId: targetUserId });
}
