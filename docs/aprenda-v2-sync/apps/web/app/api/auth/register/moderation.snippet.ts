// Alteração em apps/web/app/api/auth/register/route.ts
//
// Este é o ponto mais importante: barra o nome ofensivo ANTES de criar a conta.
// Acrescente o import e o bloco de verificação; o resto do handler continua igual.

import { moderateName, moderationErrorResponse } from "@/lib/moderation-service";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body?.name ?? "").trim();

  // --- início do bloco novo ---
  const verdict = await moderateName({ value: name, field: "USER_NAME" });
  if (!verdict.allowed) {
    return Response.json(moderationErrorResponse(verdict), { status: 422 });
  }
  // --- fim do bloco novo ---

  // ...validação de e-mail/senha e criação do usuário que já existem hoje...
}
