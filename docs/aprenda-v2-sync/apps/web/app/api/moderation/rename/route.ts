import { NextResponse } from "next/server";
import { prisma } from "database";
import { requireTeacher, teacherAuthResponse } from "@/lib/require-teacher";
import { moderateName, moderationErrorResponse } from "@/lib/moderation-service";

/**
 * Renome forçado: resolve nomes ofensivos que já estavam no banco antes do filtro.
 * Não apaga a conta nem o progresso do aluno — só troca o nome exibido.
 */
export async function POST(request: Request) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    const response = teacherAuthResponse(auth.error);
    return NextResponse.json(response.body, { status: response.status });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    newName?: string;
    note?: string;
  } | null;

  const userId = body?.userId?.trim();
  const newName = body?.newName?.trim();

  if (!userId || !newName) {
    return NextResponse.json({ error: "Informe o aluno e o novo nome" }, { status: 400 });
  }

  const verdict = await moderateName({ value: newName, field: "USER_NAME", log: false });
  if (!verdict.allowed) {
    return NextResponse.json(moderationErrorResponse(verdict), { status: 422 });
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { name: newName } });

    await tx.moderationEvent.create({
      data: {
        kind: "FORCED_RENAME",
        field: "USER_NAME",
        subjectUserId: userId,
        attemptedValue: target.name.slice(0, 280),
        note: body?.note?.slice(0, 280) ?? `Renomeado para "${newName}"`.slice(0, 280),
        resolved: true,
        resolvedById: auth.session.user.id,
        resolvedAt: new Date(),
      },
    });

    await tx.moderationEvent.updateMany({
      where: { subjectUserId: userId, resolved: false, field: "USER_NAME" },
      data: { resolved: true, resolvedById: auth.session.user.id, resolvedAt: new Date() },
    });
  });

  return NextResponse.json({ userId, previousName: target.name, newName });
}
