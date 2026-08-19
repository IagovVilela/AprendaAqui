import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireSessionUserId } from "@/lib/team-context";
import { moderateName, moderationErrorResponse } from "@/lib/moderation-service";

export async function PATCH(request: Request) {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim() ?? "";

  const verdict = await moderateName({
    value: name,
    field: "USER_NAME",
    subjectUserId: auth.userId,
  });

  if (!verdict.allowed) {
    return NextResponse.json(moderationErrorResponse(verdict), { status: 422 });
  }

  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { name },
    select: { id: true, name: true },
  });

  return NextResponse.json({ user, flagged: verdict.flagged });
}
