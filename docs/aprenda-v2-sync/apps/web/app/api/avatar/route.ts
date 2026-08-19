import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import { parseAvatarConfig } from "@/lib/avatar-config";
import { AVATAR_ITEMS, getFreeAvatarItemKeys } from "@/lib/avatar-items";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      gems: true,
      avatarConfig: true,
      inventory: { select: { itemKey: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const ownedKeys = new Set([
    ...getFreeAvatarItemKeys(),
    ...user.inventory.map((item) => item.itemKey),
  ]);

  return NextResponse.json({
    gems: user.gems,
    config: parseAvatarConfig(user.avatarConfig),
    ownedKeys: Array.from(ownedKeys),
    catalog: AVATAR_ITEMS,
  });
}
