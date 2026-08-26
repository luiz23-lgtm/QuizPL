/**
 * Script para corrigir nomes no banco de dados
 * 
 * Correções:
 * 1. "Janatas" (janatas@gmail.com) -> "Jonatas"
 * 2. "Felipe Manuela" (felipemanuela@gmail.com) -> separar em "Felipe" e "Manuela"
 * 
 * Como usar:
 *   node fix-names.js              <- usa o .env local
 *   DATABASE_URL=... node fix-names.js  <- usa banco de produção (Neon)
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixNames() {
  console.log('🔧 Iniciando correção de nomes...\n');

  try {
    // 1. Corrigir "Janatas" -> "Jonatas"
    const janatas = await prisma.user.findFirst({
      where: { email: 'janatas@gmail.com' }
    });

    if (janatas) {
      await prisma.user.update({
        where: { email: 'janatas@gmail.com' },
        data: { name: 'Jonatas' }
      });
      console.log(`✅ Corrigido: "${janatas.name}" -> "Jonatas" (janatas@gmail.com)`);
    } else {
      console.log('⚠️  Usuário janatas@gmail.com não encontrado no banco.');
    }

    // 2. Verificar "Felipe Manuela" (felipemanuela@gmail.com)
    const felipeManuela = await prisma.user.findFirst({
      where: { email: 'felipemanuela@gmail.com' }
    });

    if (felipeManuela) {
      // Corrigir o nome do usuário felipemanuela para "Felipe"
      await prisma.user.update({
        where: { email: 'felipemanuela@gmail.com' },
        data: { name: 'Felipe' }
      });
      console.log(`✅ Corrigido: "${felipeManuela.name}" -> "Felipe" (felipemanuela@gmail.com)`);
    } else {
      console.log('⚠️  Usuário felipemanuela@gmail.com não encontrado no banco.');
    }

    // 3. Verificar se "Manuela" já existe separada
    const manuela = await prisma.user.findFirst({
      where: { email: 'manuela@gmail.com' }
    });

    if (manuela) {
      console.log(`ℹ️  Manuela já existe separada: "${manuela.name}" (manuela@gmail.com)`);
    } else {
      console.log('⚠️  Manuela (manuela@gmail.com) NÃO existe no banco!');
      console.log('   -> Você precisa criar esse usuário manualmente no painel admin.');
    }

    // 4. Listar estado atual dos usuários relevantes
    console.log('\n📋 Estado atual dos usuários relacionados:');
    const usuarios = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'jonatas' } },
          { email: { contains: 'janatas' } },
          { email: { contains: 'felipe' } },
          { email: { contains: 'manuela' } },
        ]
      },
      select: { name: true, email: true }
    });

    usuarios.forEach(u => {
      console.log(`  - ${u.name.padEnd(20)} | ${u.email}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Pronto!');
  }
}

fixNames();
