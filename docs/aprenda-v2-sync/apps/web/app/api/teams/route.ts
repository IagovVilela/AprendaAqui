import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireSessionUserId } from "@/lib/team-context";
import { moderateName, moderationErrorResponse } from "@/lib/moderation-service";
import {
  MAX_TEAM_MEMBERS,
  generateInviteCode,
  slugifyTeamName,
} from "@/lib/team-roles";

export async function GET() {
  const teams = await prisma.team.findMany({
    orderBy: [{ warPoints: "desc" }, { xpTotal: "desc" }],
    take: 50,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      emblemSeed: true,
      emblemColor: true,
      joinPolicy: true,
      maxMembers: true,
      warPoints: true,
      warsWon: true,
      warsLost: true,
      _count: { select: { members: true } },
    },
  });

  return NextResponse.json({
    teams: teams.map((team) => ({
      ...team,
      memberCount: team._count.members,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    description?: string;
    emblemColor?: string;
    joinPolicy?: string;
  } | null;

  const name = body?.name?.trim() ?? "";
  if (name.length < 3 || name.length > 32) {
    return NextResponse.json({ error: "O nome deve ter de 3 a 32 caracteres" }, { status: 400 });
  }

  const slug = slugifyTeamName(name);
  if (slug.length === 0) {
    return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
  }

  const nameVerdict = await moderateName({
    value: name,
    field: "TEAM_NAME",
    subjectUserId: auth.userId,
  });

  if (!nameVerdict.allowed) {
    return NextResponse.json(moderationErrorResponse(nameVerdict), { status: 422 });
  }

  const description = body?.description?.trim().slice(0, 280) || null;

  if (description) {
    const descriptionVerdict = await moderateName({
      value: description,
      field: "TEAM_DESCRIPTION",
      subjectUserId: auth.userId,
    });

    if (!descriptionVerdict.allowed) {
      return NextResponse.json(moderationErrorResponse(descriptionVerdict), { status: 422 });
    }
  }

  const joinPolicy = body?.joinPolicy === "INVITE_ONLY" ? "INVITE_ONLY" : "REQUEST";

  const existingMembership = await prisma.teamMember.findUnique({
    where: { userId: auth.userId },
    select: { teamId: true },
  });

  if (existingMembership) {
    return NextResponse.json(
      { error: "Você já está em uma equipe. Saia dela antes de criar outra." },
      { status: 409 }
    );
  }

  const nameTaken = await prisma.team.findFirst({
    where: { OR: [{ name }, { slug }] },
    select: { id: true },
  });

  if (nameTaken) {
    return NextResponse.json({ error: "Já existe uma equipe com esse nome" }, { status: 409 });
  }

  const team = await prisma.$transaction(async (tx) => {
    const created = await tx.team.create({
      data: {
        name,
        slug,
        description,
        emblemSeed: slug,
        emblemColor: /^#[0-9a-fA-F]{6}$/.test(body?.emblemColor ?? "")
          ? (body?.emblemColor as string)
          : "#58CC02",
        joinPolicy,
        maxMembers: MAX_TEAM_MEMBERS,
        ownerId: auth.userId,
      },
    });

    await tx.teamMember.create({
      data: { teamId: created.id, userId: auth.userId, role: "OWNER" },
    });

    await tx.teamInvite.create({
      data: { teamId: created.id, code: generateInviteCode(), createdById: auth.userId },
    });

    return created;
  });

  return NextResponse.json({ team }, { status: 201 });
}
