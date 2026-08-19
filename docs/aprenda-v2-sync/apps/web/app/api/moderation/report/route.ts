import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireSessionUserId } from "@/lib/team-context";

const REPORT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REPORTS_PER_WINDOW = 10;

/** Denúncia de nome por aluno. O filtro pega o óbvio; a denúncia pega o resto. */
export async function POST(request: Request) {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    reason?: string;
  } | null;

  const subjectUserId = body?.userId?.trim();

  if (!subjectUserId || subjectUserId === auth.userId) {
    return NextResponse.json({ error: "Denúncia inválida" }, { status: 400 });
  }

  const recentReports = await prisma.moderationEvent.count({
    where: {
      reporterId: auth.userId,
      kind: "USER_REPORT",
      createdAt: { gte: new Date(Date.now() - REPORT_WINDOW_MS) },
    },
  });

  if (recentReports >= MAX_REPORTS_PER_WINDOW) {
    return NextResponse.json(
      { error: "Você fez muitas denúncias agora. Tente mais tarde." },
      { status: 429 }
    );
  }

  const subject = await prisma.user.findUnique({
    where: { id: subjectUserId },
    select: { id: true, name: true },
  });

  if (!subject) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const alreadyReported = await prisma.moderationEvent.findFirst({
    where: {
      kind: "USER_REPORT",
      reporterId: auth.userId,
      subjectUserId,
      resolved: false,
    },
    select: { id: true },
  });

  if (alreadyReported) {
    return NextResponse.json({ reported: true, duplicate: true });
  }

  await prisma.moderationEvent.create({
    data: {
      kind: "USER_REPORT",
      field: "USER_NAME",
      subjectUserId,
      reporterId: auth.userId,
      attemptedValue: subject.name.slice(0, 280),
      note: body?.reason?.slice(0, 280) ?? null,
    },
  });

  return NextResponse.json({ reported: true });
}
