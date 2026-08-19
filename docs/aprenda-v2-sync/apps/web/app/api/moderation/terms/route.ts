import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { invalidateTermsCache } from "@/lib/moderation-service";

export async function GET() {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const response = teacherAuthResponse(auth.error);
    return NextResponse.json(response.body, { status: response.status });
  }

  const terms = await prisma.moderationTerm.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      term: true,
      severity: true,
      category: true,
      matchMode: true,
      active: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ terms });
}

export async function POST(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const response = teacherAuthResponse(auth.error);
    return NextResponse.json(response.body, { status: response.status });
  }

  const body = (await request.json().catch(() => null)) as {
    term?: string;
    severity?: "BLOCK" | "REVIEW";
    category?: "PROFANITY" | "SLUR" | "SEXUAL" | "IMPERSONATION" | "SPAM";
    matchMode?: "TOKEN" | "CONTAINS";
  } | null;

  const term = body?.term?.trim().toLowerCase();

  if (!term || term.length < 2 || term.length > 64) {
    return NextResponse.json({ error: "Termo inválido" }, { status: 400 });
  }

  const created = await prisma.moderationTerm.upsert({
    where: { term },
    create: {
      term,
      severity: body?.severity ?? "BLOCK",
      category: body?.category ?? "PROFANITY",
      matchMode: body?.matchMode ?? "CONTAINS",
      createdById: auth.session.user.id,
      active: true,
    },
    update: {
      active: true,
      severity: body?.severity ?? "BLOCK",
      category: body?.category ?? "PROFANITY",
      matchMode: body?.matchMode ?? "CONTAINS",
    },
    select: { id: true, term: true, severity: true, category: true, matchMode: true },
  });

  invalidateTermsCache();

  return NextResponse.json({ term: created }, { status: 201 });
}

/** Desativa em vez de apagar: mantém o histórico de moderação auditável. */
export async function DELETE(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const response = teacherAuthResponse(auth.error);
    return NextResponse.json(response.body, { status: response.status });
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id?.trim();

  if (!id) {
    return NextResponse.json({ error: "Informe o termo" }, { status: 400 });
  }

  await prisma.moderationTerm.update({ where: { id }, data: { active: false } });
  invalidateTermsCache();

  return NextResponse.json({ deactivated: id });
}
