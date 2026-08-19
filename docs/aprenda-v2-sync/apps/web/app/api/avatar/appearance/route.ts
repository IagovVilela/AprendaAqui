import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "database";
import { authOptions } from "@/lib/auth";
import { parseAvatarConfig } from "@/lib/avatar-config";
import {
  isHairColorUnlocked,
  isPantsColorAllowed,
  isShirtColorAllowed,
  isSkinToneAllowed,
} from "@/lib/avatar-items";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    skinTone?: string;
    hairColor?: string;
    shirtColor?: string;
    pantsColor?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
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

  const owned = new Set(user.inventory.map((row) => row.itemKey));
  const config = parseAvatarConfig(user.avatarConfig);

  if (body.skinTone) {
    if (!isSkinToneAllowed(body.skinTone)) {
      return NextResponse.json({ error: "Tom de pele inválido" }, { status: 400 });
    }
    config.skinTone = body.skinTone;
  }

  if (body.hairColor) {
    if (!isHairColorUnlocked(body.hairColor, owned)) {
      return NextResponse.json({ error: "Cor de cabelo bloqueada" }, { status: 403 });
    }
    config.hairColor = body.hairColor;
  }

  if (body.shirtColor) {
    if (!isShirtColorAllowed(body.shirtColor)) {
      return NextResponse.json({ error: "Cor de camisa inválida" }, { status: 400 });
    }
    config.shirtColor = body.shirtColor;
  }

  if (body.pantsColor) {
    if (!isPantsColorAllowed(body.pantsColor)) {
      return NextResponse.json({ error: "Cor de calça inválida" }, { status: 400 });
    }
    config.pantsColor = body.pantsColor;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarConfig: config },
  });

  return NextResponse.json({ config });
}
