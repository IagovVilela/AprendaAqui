import { NextResponse } from "next/server";
import { moderateName } from "@/lib/moderation-service";

/**
 * Validação em tempo real para o formulário avisar antes de enviar.
 * Não registra evento: quem decide é a rota que efetivamente grava o nome.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    value?: string;
    field?: "USER_NAME" | "TEAM_NAME";
  } | null;

  const value = body?.value ?? "";
  if (value.trim().length === 0) {
    return NextResponse.json({ allowed: true, reason: null });
  }

  const verdict = await moderateName({
    value,
    field: body?.field === "TEAM_NAME" ? "TEAM_NAME" : "USER_NAME",
    log: false,
  });

  return NextResponse.json({ allowed: verdict.allowed, reason: verdict.reason });
}
