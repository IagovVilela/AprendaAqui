import { PrismaClient } from "@prisma/client";
import { syncQuestionBankFromLessons } from "../src/quiz-question-bank";

const prisma = new PrismaClient();

/**
 * Popula o banco de perguntas das batalhas a partir das lições QUIZ já existentes.
 * Aditivo e idempotente: não apaga nem altera lições, trilhas ou perguntas existentes.
 * Pode rodar quantas vezes quiser.
 */
async function main() {
  const result = await syncQuestionBankFromLessons(prisma);
  console.log(
    `[question-bank] perguntas criadas: ${result.created}; já existentes preservadas: ${result.skipped}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
