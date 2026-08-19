import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { gemsForXp } from "../src/gems";
import { buildTracksSeedData } from "./seed-tracks-data";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "aprenda@adm.com.br";

/**
 * Seed aditivo. Nunca apaga usuários, progresso, gemas, inventário
 * nem trilhas/lições que já existem no banco.
 *
 * - Trilha com o mesmo slug: preservada (seed atual permanece).
 * - Trilha nova: inserida com unidades, lições e baús.
 * - Admin: criado só se o e-mail ainda não existir (senha atual não muda).
 */
async function ensureTracks(): Promise<void> {
  const catalog = buildTracksSeedData();
  let created = 0;
  let skipped = 0;

  for (const trackData of catalog) {
    const { units, ...trackFields } = trackData;
    const existing = await prisma.track.findFirst({
      where: { slug: trackFields.slug },
      select: { id: true, title: true, slug: true },
    });

    if (existing) {
      skipped += 1;
      console.log(`[ensure] trilha "${existing.slug}" já existe — conteúdo preservado`);
      continue;
    }

    const track = await prisma.track.create({ data: trackFields });

    for (const unitData of units) {
      const { lessons, ...unitFields } = unitData;
      const unit = await prisma.unit.create({
        data: { ...unitFields, trackId: track.id },
      });

      let lastLessonInUnit: { id: string } | null = null;

      for (const lessonData of lessons) {
        const { xpReward, ...rest } = lessonData;
        const lesson = await prisma.lesson.create({
          data: {
            ...rest,
            xpReward,
            gemsReward: gemsForXp(xpReward),
            trackId: track.id,
            unitId: unit.id,
          },
        });
        lastLessonInUnit = lesson;
      }

      if (lastLessonInUnit) {
        const unitXpBonus = 20 + unitFields.order * 10;
        const unitGemsBonus = 10 + unitFields.order * 5;
        await prisma.trackChest.create({
          data: {
            trackId: track.id,
            afterLessonId: lastLessonInUnit.id,
            title: `Baú: ${unitFields.title}`,
            xpReward: unitXpBonus,
            gemsReward: unitGemsBonus,
            order: unitFields.order,
          },
        });
      }
    }

    created += 1;
    console.log(`[ensure] trilha "${track.slug}" criada`);
  }

  console.log(`[ensure] trilhas criadas: ${created}; trilhas preservadas: ${skipped}`);
}

async function ensureAdmin(): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true, email: true },
  });

  if (existing) {
    console.log(`[ensure] admin ${ADMIN_EMAIL} já existe — senha e dados preservados`);
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 10);
  await prisma.user.create({
    data: {
      name: "Aprenda@adm",
      email: ADMIN_EMAIL,
      passwordHash,
      role: UserRole.TEACHER,
    },
  });
  console.log(`[ensure] admin ${ADMIN_EMAIL} criado`);
}

async function assertNotDestructive(): Promise<void> {
  if (process.env.ALLOW_DESTRUCTIVE_SEED === "true") {
    throw new Error(
      "ALLOW_DESTRUCTIVE_SEED foi recusado: este projeto não apaga dados nem o seed existente."
    );
  }
}

async function main() {
  await assertNotDestructive();
  await ensureTracks();
  await ensureAdmin();
  console.log("[ensure] concluído sem apagar nenhum registro");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
