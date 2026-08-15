import { PrismaClient, ActivityType, NotificationType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { gemsForXp } from "../src/gems";
import { syncLevelRewardsForUser } from "../src/sync-level-rewards";
import { buildTracksSeedData } from "./seed-tracks-data";

const prisma = new PrismaClient();

function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  await prisma.notification.deleteMany();
  await prisma.activityEvent.deleteMany();
  await prisma.userChestClaim.deleteMany();
  await prisma.userTitleUnlock.deleteMany();
  await prisma.trackChest.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.track.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo123", 10);
  const adminPasswordHash = await bcrypt.hash("123456", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Dev",
      email: "demo@aprendaqui.com.br",
      passwordHash,
      xpTotal: 0,
      streakAtual: 3,
      ultimaAtividade: new Date(),
      role: UserRole.STUDENT,
    },
  });

  await prisma.user.create({
    data: {
      name: "Aprenda@adm",
      email: "aprenda@adm.com.br",
      passwordHash: adminPasswordHash,
      role: UserRole.TEACHER,
    },
  });

  const tracksData = buildTracksSeedData();

  const allLessons: { id: string; xpReward: number; gemsReward: number }[] = [];

  for (const trackData of tracksData) {
    const { units, ...trackFields } = trackData;
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
        allLessons.push({
          id: lesson.id,
          xpReward: lesson.xpReward,
          gemsReward: lesson.gemsReward,
        });
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
  }

  const weekStart = getWeekStart();
  const completedLessons = allLessons.slice(0, 8);
  let demoXpTotal = 0;
  let demoGemsTotal = 0;

  for (let i = 0; i < completedLessons.length; i++) {
    const lesson = completedLessons[i];
    demoXpTotal += lesson.xpReward;
    demoGemsTotal += lesson.gemsReward;

    const completedAt = new Date(weekStart);
    completedAt.setDate(completedAt.getDate() + (i % 7));
    completedAt.setHours(10 + i, 0, 0, 0);

    await prisma.userProgress.create({
      data: {
        userId: demoUser.id,
        lessonId: lesson.id,
        xpEarned: lesson.xpReward,
        completedAt,
      },
    });
  }

  const demoLevelSync = await syncLevelRewardsForUser(prisma, demoUser.id, demoXpTotal);

  await prisma.user.update({
    where: { id: demoUser.id },
    data: {
      xpTotal: demoXpTotal,
      gems: demoGemsTotal + demoLevelSync.totalGemsFromLevels,
      activeTitleKey: demoLevelSync.activeTitleKey,
      lastCelebratedLevel: demoLevelSync.level,
    },
  });

  const now = new Date();
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const maria = await prisma.user.create({
    data: {
      name: "Maria Silva",
      email: "maria@aprendaqui.com.br",
      passwordHash,
      xpTotal: 45,
      streakAtual: 5,
      ultimaAtividade: fiveMinAgo,
    },
  });

  const joao = await prisma.user.create({
    data: {
      name: "João Costa",
      email: "joao@aprendaqui.com.br",
      passwordHash,
      xpTotal: 30,
      streakAtual: 2,
      ultimaAtividade: twoHoursAgo,
    },
  });

  const ana = await prisma.user.create({
    data: {
      name: "Ana Lima",
      email: "ana@aprendaqui.com.br",
      passwordHash,
      xpTotal: 20,
      streakAtual: 1,
      ultimaAtividade: now,
    },
  });

  const carlos = await prisma.user.create({
    data: {
      name: "Carlos Mendes",
      email: "carlos@aprendaqui.com.br",
      passwordHash,
      xpTotal: 15,
      streakAtual: 0,
      ultimaAtividade: twoHoursAgo,
    },
  });

  for (const [user, lessonCount] of [
    [maria, 5],
    [joao, 4],
    [ana, 3],
    [carlos, 2],
  ] as const) {
    let xp = 0;
    for (let i = 0; i < lessonCount; i++) {
      const lesson = allLessons[i];
      xp += lesson.xpReward;
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          lessonId: lesson.id,
          xpEarned: lesson.xpReward,
          completedAt: new Date(weekStart.getTime() + i * 86400000),
        },
      });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { xpTotal: xp },
    });

    const sync = await syncLevelRewardsForUser(prisma, user.id, xp);
    const current = await prisma.user.findUnique({
      where: { id: user.id },
      select: { gems: true },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        gems: (current?.gems ?? 0) + sync.totalGemsFromLevels,
        activeTitleKey: sync.activeTitleKey,
        lastCelebratedLevel: sync.level,
      },
    });
  }

  await prisma.friendship.create({
    data: {
      requesterId: maria.id,
      addresseeId: demoUser.id,
      status: "ACCEPTED",
    },
  });

  await prisma.friendship.create({
    data: {
      requesterId: demoUser.id,
      addresseeId: joao.id,
      status: "ACCEPTED",
    },
  });

  const pendingAna = await prisma.friendship.create({
    data: {
      requesterId: ana.id,
      addresseeId: demoUser.id,
      status: "PENDING",
    },
  });

  const pendingCarlos = await prisma.friendship.create({
    data: {
      requesterId: carlos.id,
      addresseeId: demoUser.id,
      status: "PENDING",
    },
  });

  const firstLesson = completedLessons[0];
  const firstLessonFull = await prisma.lesson.findUnique({
    where: { id: firstLesson.id },
    include: { track: { select: { title: true } } },
  });

  if (firstLessonFull) {
    const activityMeta = {
      lessonId: firstLessonFull.id,
      lessonTitle: firstLessonFull.title,
      trackTitle: firstLessonFull.track.title,
      xpEarned: firstLessonFull.xpReward,
    };

    await prisma.activityEvent.createMany({
      data: [
        {
          userId: maria.id,
          type: ActivityType.LESSON_COMPLETED,
          metadata: activityMeta,
          createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        },
        {
          userId: joao.id,
          type: ActivityType.LESSON_COMPLETED,
          metadata: activityMeta,
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
        {
          userId: demoUser.id,
          type: ActivityType.LESSON_COMPLETED,
          metadata: activityMeta,
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        },
      ],
    });
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        actorId: ana.id,
        type: NotificationType.FRIEND_REQUEST,
        read: false,
        metadata: {
          friendshipId: pendingAna.id,
          actorName: ana.name,
        },
      },
      {
        userId: demoUser.id,
        actorId: carlos.id,
        type: NotificationType.FRIEND_REQUEST,
        read: false,
        metadata: {
          friendshipId: pendingCarlos.id,
          actorName: carlos.name,
        },
      },
      {
        userId: demoUser.id,
        actorId: maria.id,
        type: NotificationType.FRIEND_ACTIVITY,
        read: true,
        metadata: {
          actorName: maria.name,
          lessonTitle: firstLessonFull?.title ?? "O que é HTML?",
          trackTitle: firstLessonFull?.track.title ?? "HTML",
        },
        createdAt: new Date(now.getTime() - 45 * 60 * 1000),
      },
    ],
  });

  console.log("Seed concluído!");
  console.log("Admin: aprenda@adm.com.br / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
