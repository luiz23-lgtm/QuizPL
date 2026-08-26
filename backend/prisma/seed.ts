import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@xp.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@xp.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create subjects
  const subjects = [
    'Matemática',
    'Português',
    'História',
    'Geografia',
    'Ciências',
    'Inglês',
    'Educação Financeira',
  ];

  for (const subjectName of subjects) {
    await prisma.subject.upsert({
      where: { name: subjectName },
      update: {},
      create: { name: subjectName },
    });
  }

  // Create achievements
  const achievements = [
    {
      name: 'Primeira Atividade',
      description: 'Complete sua primeira atividade',
      icon: '🏆',
      type: 'FIRST_ACTIVITY',
      requirement: 1,
    },
    {
      name: 'Primeira Prova',
      description: 'Realize sua primeira prova',
      icon: '📝',
      type: 'FIRST_QUIZ',
      requirement: 1,
    },
    {
      name: '10 Quizzes',
      description: 'Responda 10 quizzes',
      icon: '🎯',
      type: 'QUIZ_COUNT',
      requirement: 10,
    },
    {
      name: '50 Quizzes',
      description: 'Responda 50 quizzes',
      icon: '🌟',
      type: 'QUIZ_COUNT',
      requirement: 50,
    },
    {
      name: 'Top 10',
      description: 'Esteja entre os 10 primeiros do ranking',
      icon: '🥇',
      type: 'RANKING',
      requirement: 10,
    },
    {
      name: 'Top 3',
      description: 'Esteja entre os 3 primeiros do ranking',
      icon: '🏅',
      type: 'RANKING',
      requirement: 3,
    },
    {
      name: 'Sequência de 7 dias',
      description: 'Estude por 7 dias consecutivos',
      icon: '🔥',
      type: 'STREAK',
      requirement: 7,
    },
    {
      name: 'Sequência de 30 dias',
      description: 'Estude por 30 dias consecutivos',
      icon: '💎',
      type: 'STREAK',
      requirement: 30,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  // Create example quizzes
  const mathSubject = await prisma.subject.findFirst({ where: { name: 'Matemática' } });
  const portugueseSubject = await prisma.subject.findFirst({ where: { name: 'Português' } });

  if (mathSubject) {
    const quiz1 = await prisma.quiz.create({
      data: {
        title: 'Matemática Básica',
        description: 'Teste seus conhecimentos em matemática básica',
        subjectId: mathSubject.id,
        questions: {
          create: [
            {
              text: 'Quanto é 2 + 2?',
              optionA: '3',
              optionB: '4',
              optionC: '5',
              optionD: '6',
              correctOption: 'B',
              explanation: '2 + 2 = 4',
              xpReward: 10,
            },
            {
              text: 'Quanto é 5 x 5?',
              optionA: '20',
              optionB: '25',
              optionC: '30',
              optionD: '35',
              correctOption: 'B',
              explanation: '5 x 5 = 25',
              xpReward: 10,
            },
          ],
        },
      },
    });

    const quiz2 = await prisma.quiz.create({
      data: {
        title: 'Geometria Básica',
        description: 'Questões sobre figuras geométricas',
        subjectId: mathSubject.id,
        questions: {
          create: [
            {
              text: 'Quantos lados tem um triângulo?',
              optionA: '2',
              optionB: '3',
              optionC: '4',
              optionD: '5',
              correctOption: 'B',
              explanation: 'Um triângulo tem 3 lados',
              xpReward: 10,
            },
            {
              text: 'Qual a área de um quadrado com lado 4?',
              optionA: '8',
              optionB: '12',
              optionC: '16',
              optionD: '20',
              correctOption: 'C',
              explanation: 'Área = lado² = 4² = 16',
              xpReward: 10,
            },
          ],
        },
      },
    });
  }

  if (portugueseSubject) {
    const quiz3 = await prisma.quiz.create({
      data: {
        title: 'Gramática Básica',
        description: 'Teste seus conhecimentos em gramática',
        subjectId: portugueseSubject.id,
        questions: {
          create: [
            {
              text: 'Qual é o substantivo na frase: "O gato comeu o peixe"?',
              optionA: 'comeu',
              optionB: 'gato',
              optionC: 'o',
              optionD: 'e',
              correctOption: 'B',
              explanation: '"Gato" é um substantivo comum',
              xpReward: 10,
            },
            {
              text: 'Qual é o verbo na frase: "Ela cantou uma música"?',
              optionA: 'Ela',
              optionB: 'cantou',
              optionC: 'uma',
              optionD: 'música',
              correctOption: 'B',
              explanation: '"Cantou" é um verbo no passado',
              xpReward: 10,
            },
          ],
        },
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
