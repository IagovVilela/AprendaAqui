import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";

export async function GET(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const response = teacherAuthResponse(auth.error);
    return NextResponse.json(response.body, { status: response.status });
  }

  const { searchParams } = new URL(request.url);
  const onlyPending = searchParams.get("pending") !== "false";

  const events = await prisma.moderationEvent.findMany({
    where: onlyPending ? { resolved: false } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      kind: true,
      field: true,
      attemptedValue: true,
      matchedTerm: true,
      severity: true,
      category: true,
      note: true,
      resolved: true,
      createdAt: true,
      subjectUser: { select: { id: true, name: true, email: true } },
      reporter: { select: { id: true, name: true } },
    },
  });

  const counts = await prisma.moderationEvent.groupBy({
    by: ["kind"],
    where: { resolved: false },
    _count: { _all: true },
  });

  return NextResponse.json({
    events,
    pendingByKind: Object.fromEntries(counts.map((row) => [row.kind, row._count._all])),
  });
}

export async function PATCH(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const response = teacherAuthResponse(auth.error);
    return NextResponse.json(response.body, { status: response.status });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    note?: string;
  } | null;

  const id = body?.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Informe o evento" }, { status: 400 });
  }

  await prisma.moderationEvent.update({
    where: { id },
    data: {
      resolved: true,
      resolvedById: auth.session.user.id,
      resolvedAt: new Date(),
      note: body?.note?.slice(0, 280) ?? null,
    },
  });

  return NextResponse.json({ resolved: id });
}
