import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamMembership } from "@/lib/team-context";
import { can, canActOnMember, type TeamRoleKey } from "@/lib/team-roles";

/** Promover/rebaixar administradores. Só o dono. */
export async function PATCH(request: Request) {
  const result = await requireTeamMembership();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  if (!can(result.context.role, "members.promote")) {
    return NextResponse.json({ error: "Apenas o dono altera papéis" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    role?: string;
  } | null;

  const targetUserId = body?.userId?.trim();
  const nextRole = body?.role;

  if (!targetUserId || (nextRole !== "ADMIN" && nextRole !== "MEMBER")) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  if (targetUserId === result.context.userId) {
    return NextResponse.json({ error: "Você não pode alterar seu próprio papel" }, { status: 400 });
  }

  const target = await prisma.teamMember.findUnique({
    where: { userId: targetUserId },
    select: { id: true, teamId: true, role: true },
  });

  if (!target || target.teamId !== result.context.teamId) {
    return NextResponse.json({ error: "Membro não encontrado na sua equipe" }, { status: 404 });
  }

  if (!canActOnMember(result.context.role, target.role as TeamRoleKey)) {
    return NextResponse.json({ error: "Ação não permitida sobre este membro" }, { status: 403 });
  }

  await prisma.teamMember.update({
    where: { id: target.id },
    data: { role: nextRole },
  });

  return NextResponse.json({ userId: targetUserId, role: nextRole });
}

/** Expulsar membro. Dono e administradores (admin não expulsa admin). */
export async function DELETE(request: Request) {
  const result = await requireTeamMembership();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  if (!can(result.context.role, "members.kick")) {
    return NextResponse.json({ error: "Seu papel não permite expulsar" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { userId?: string } | null;
  const targetUserId = body?.userId?.trim();

  if (!targetUserId) {
    return NextResponse.json({ error: "Informe o membro" }, { status: 400 });
  }

  if (targetUserId === result.context.userId) {
    return NextResponse.json(
      { error: "Para sair da equipe use a opção de saída" },
      { status: 400 }
    );
  }

  const target = await prisma.teamMember.findUnique({
    where: { userId: targetUserId },
    select: { id: true, teamId: true, role: true },
  });

  if (!target || target.teamId !== result.context.teamId) {
    return NextResponse.json({ error: "Membro não encontrado na sua equipe" }, { status: 404 });
  }

  if (!canActOnMember(result.context.role, target.role as TeamRoleKey)) {
    return NextResponse.json({ error: "Ação não permitida sobre este membro" }, { status: 403 });
  }

  await prisma.teamMember.delete({ where: { id: target.id } });

  return NextResponse.json({ removed: targetUserId });
}
