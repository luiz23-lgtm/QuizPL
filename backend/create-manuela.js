const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();

  // Ver qual é o próximo ID disponível
  const maxId = await client.query('SELECT MAX(id) as max FROM users');
  const nextId = maxId.rows[0].max + 1;
  console.log(`Próximo ID disponível: ${nextId}`);

  // Verificar se manuela@gmail.com já existe
  const exists = await client.query("SELECT id, name, email FROM users WHERE email = 'manuela@gmail.com'");
  
  if (exists.rows.length > 0) {
    console.log(`Manuela já existe: ${JSON.stringify(exists.rows[0])}`);
    // Só atualizar o nome
    await client.query("UPDATE users SET name = 'Manuela' WHERE email = 'manuela@gmail.com'");
    console.log('✅ Nome atualizado para Manuela');
  } else {
    // Criar com ID explícito
    const password = 'manuela123';
    const hashed = await bcrypt.hash(password, 10);
    
    await client.query(
      `INSERT INTO users (id, name, email, password, role) VALUES ($1, 'Manuela', 'manuela@gmail.com', $2, 'USER')`,
      [nextId, hashed]
    );
    console.log(`✅ Manuela criada! id=${nextId} | email=manuela@gmail.com | senha=manuela123`);
  }

  // Confirmar resultado
  const final = await client.query("SELECT id, name, email FROM users WHERE email = 'manuela@gmail.com'");
  console.log('\n📋 Resultado final:', JSON.stringify(final.rows[0]));

  await client.end();
}

run().catch(async e => {
  console.error('Erro:', e.message);
  console.error(e);
  await client.end();
});
