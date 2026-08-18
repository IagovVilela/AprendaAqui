import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import { getAvatarItem } from "@/lib/avatar-items";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { itemKey?: string } | null;
  const itemKey = body?.itemKey?.trim();
  const item = itemKey ? getAvatarItem(itemKey) : undefined;

  if (!item) {
    return NextResponse.json({ error: "Item inválido" }, { status: 400 });
  }

  if (item.free || item.priceGems <= 0) {
    return NextResponse.json({ error: "Este item já é gratuito" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.userInventoryItem.findFirst({
        where: {
          userId: session.user.id,
          itemKey: item.key,
        },
      });

      if (existing) {
        return { error: "Você já possui este item", status: 409 as const };
      }

      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { gems: true },
      });

      if (!user) {
        return { error: "Usuário não encontrado", status: 404 as const };
      }

      if (user.gems < item.priceGems) {
        return { error: "Gemas insuficientes", status: 400 as const };
      }

      const updated = await tx.user.update({
        where: { id: session.user.id },
        data: { gems: { decrement: item.priceGems } },
        select: { gems: true },
      });

      await tx.userInventoryItem.create({
        data: {
          userId: session.user.id,
          itemKey: item.key,
        },
      });

      return { gems: updated.gems, itemKey: item.key };
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("avatar purchase failed", error);
    return NextResponse.json({ error: "Não foi possível comprar o item" }, { status: 500 });
  }
}
