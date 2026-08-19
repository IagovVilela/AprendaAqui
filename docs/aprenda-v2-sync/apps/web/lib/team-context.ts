import { getServerSession } from "next-auth";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import type { TeamPermission, TeamRoleKey } from "@/lib/team-roles";
import { can } from "@/lib/team-roles";

export type TeamContext = {
  userId: string;
  teamId: string;
  role: TeamRoleKey;
};

export type TeamContextResult =
  | { ok: true; context: TeamContext }
  | { ok: false; status: 401 | 403 | 404; error: string };

export async function requireSessionUserId(): Promise<
  { ok: true; userId: string } | { ok: false; status: 401; error: string }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, status: 401, error: "Não autenticado" };
  }
  return { ok: true, userId: session.user.id };
}

export async function requireTeamMembership(): Promise<TeamContextResult> {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return { ok: false, status: 401, error: auth.error };
  }

  const membership = await prisma.teamMember.findUnique({
    where: { userId: auth.userId },
    select: { teamId: true, role: true },
  });

  if (!membership) {
    return { ok: false, status: 404, error: "Você não está em uma equipe" };
  }

  return {
    ok: true,
    context: {
      userId: auth.userId,
      teamId: membership.teamId,
      role: membership.role as TeamRoleKey,
    },
  };
}

export async function requireTeamPermission(
  permission: TeamPermission
): Promise<TeamContextResult> {
  const result = await requireTeamMembership();
  if (!result.ok) return result;

  if (!can(result.context.role, permission)) {
    return { ok: false, status: 403, error: "Seu papel não permite esta ação" };
  }

  return result;
}
