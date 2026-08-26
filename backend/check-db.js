const { PrismaClient } = require('./src/generated/prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('=== QUESTIONS ===');
  const questions = await prisma.question.findMany({
    select: { id: true, text: true, correctOption: true },
    take: 5
  });
  console.log(JSON.stringify(questions, null, 2));

  console.log('\n=== USERS ===');
  const users = await prisma.user.findMany({
    select: { id: true, name: true, xp: true, level: true },
    take: 5
  });
  console.log(JSON.stringify(users, null, 2));

  console.log('\n=== ANSWERS ===');
  const answers = await prisma.answer.findMany({
    take: 5,
    include: { question: { select: { correctOption: true } } }
  });
  console.log(JSON.stringify(answers, null, 2));

  await prisma.$disconnect();
}

checkDatabase().catch(console.error);
