const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log('✅ Conectado ao Neon!\n');

  const r1 = await client.query(
    "UPDATE users SET name = 'Jonatas' WHERE email = 'janatas@gmail.com'"
  );
  console.log(`Janatas -> Jonatas: ${r1.rowCount} linha(s) atualizada(s)`);

  const r2 = await client.query(
    "UPDATE users SET name = 'Felipe' WHERE email = 'felipemanuela@gmail.com'"
  );
  console.log(`Felipe Manuela -> Felipe: ${r2.rowCount} linha(s) atualizada(s)`);

  const resultado = await client.query(
    "SELECT name, email FROM users WHERE email IN ('janatas@gmail.com','felipemanuela@gmail.com','manuela@gmail.com')"
  );

  console.log('\n📋 Estado atual no banco:');
  resultado.rows.forEach(u => console.log(` - ${u.name.padEnd(20)} | ${u.email}`));

  await client.end();
  console.log('\n✅ Pronto!');
}

run().catch(e => { console.error('❌ Erro:', e.message); client.end(); });
