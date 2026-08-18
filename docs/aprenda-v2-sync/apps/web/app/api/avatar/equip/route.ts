import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import { parseAvatarConfig } from "@/lib/avatar-config";
import { getAvatarItem, getFreeAvatarItemKeys } from "@/lib/avatar-items";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    slot?: string;
    itemKey?: string | null;
  } | null;

  const slot = body?.slot;
  const itemKey = body?.itemKey ?? null;

  if (
    slot !== "hair" &&
    slot !== "hat" &&
    slot !== "glasses" &&
    slot !== "face" &&
    slot !== "neck" &&
    slot !== "cape" &&
    slot !== "backpack" &&
    slot !== "hands" &&
    slot !== "pet"
  ) {
    return NextResponse.json({ error: "Slot inválido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      avatarConfig: true,
      inventory: { select: { itemKey: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const owned = new Set([...getFreeAvatarItemKeys(), ...user.inventory.map((row) => row.itemKey)]);
  const config = parseAvatarConfig(user.avatarConfig);

  if (itemKey) {
    const item = getAvatarItem(itemKey);
    if (!item || item.slot !== slot) {
      return NextResponse.json({ error: "Item incompatível com o slot" }, { status: 400 });
    }
    if (!owned.has(itemKey)) {
      return NextResponse.json({ error: "Você ainda não possui este item" }, { status: 403 });
    }
    config.equipped[slot] = itemKey;
  } else if (slot === "hair") {
    config.equipped.hair = "hair-short";
  } else {
    delete config.equipped[slot];
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarConfig: config },
  });

  return NextResponse.json({ config });
}
