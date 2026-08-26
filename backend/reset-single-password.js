const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'quiz_db',
  user: 'postgres',
  password: '2404',
});

async function resetSinglePassword() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Uso: node reset-single-password.js <email>');
    console.log('Exemplo: node reset-single-password.js admin@xp.com');
    process.exit(1);
  }

  try {
    console.log('Conectando ao banco de dados...');
    await pool.connect();
    
    // Buscar usuário
    const result = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log(`❌ Usuário com email ${email} não encontrado`);
      process.exit(1);
    }
    
    const user = result.rows[0];
    
    // Gerar senha simples
    const simplePassword = user.email.split('@')[0] + '123';
    const hashedPassword = await bcrypt.hash(simplePassword, 10);
    
    // Atualizar senha
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, user.id]
    );
    
    console.log(`✅ ${user.name} (${user.email}) -> Senha: ${simplePassword}`);
    
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
  } finally {
    await pool.end();
  }
}

resetSinglePassword();