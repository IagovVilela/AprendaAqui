import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeamMembership } from "@/lib/team-context";

/**
 * O dono não sai deixando a equipe sem responsável: ou transfere a posse,
 * ou é o último membro e a equipe é dissolvida junto.
 */
export async function POST() {
  const result = await requireTeamMembership();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { teamId, userId, role } = result.context;

  const memberCount = await prisma.teamMember.count({ where: { teamId } });

  if (role === "OWNER" && memberCount > 1) {
    return NextResponse.json(
      { error: "Transfira a posse da equipe antes de sair" },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.deleteMany({ where: { teamId, userId } });

    if (role === "OWNER" && memberCount === 1) {
      await tx.team.delete({ where: { id: teamId } });
    }
  });

  return NextResponse.json({ left: true, teamDissolved: role === "OWNER" && memberCount === 1 });
}
