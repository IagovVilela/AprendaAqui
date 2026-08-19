import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamPermission } from "@/lib/team-context";
import { generateInviteCode } from "@/lib/team-roles";

/** Gera um código novo e revoga os anteriores, para o link antigo parar de valer. */
export async function POST() {
  const result = await requireTeamPermission("team.edit");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { teamId, userId } = result.context;

  const invite = await prisma.$transaction(async (tx) => {
    await tx.teamInvite.updateMany({
      where: { teamId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return tx.teamInvite.create({
      data: { teamId, code: generateInviteCode(), createdById: userId },
      select: { code: true, createdAt: true },
    });
  });

  return NextResponse.json({ invite });
}
