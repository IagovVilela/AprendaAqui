import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { requireSessionUserId } from "@/lib/team-context";

const TOKEN_MAX_AGE_SECONDS = 60 * 60;

/**
 * Token curto só para o WebSocket. Evita expor o cookie httpOnly da sessão:
 * o serviço api valida este token com o mesmo NEXTAUTH_SECRET.
 */
export async function POST() {
  const auth = await requireSessionUserId();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "NEXTAUTH_SECRET ausente" }, { status: 500 });
  }

  const token = await encode({
    secret,
    maxAge: TOKEN_MAX_AGE_SECONDS,
    token: { id: auth.userId },
  });

  return NextResponse.json({ token, expiresIn: TOKEN_MAX_AGE_SECONDS });
}
