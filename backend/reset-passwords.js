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

async function resetPasswords() {
  try {
    console.log('Conectando ao banco de dados...');
    await pool.connect();
    
    // Buscar todos os usuários
    const result = await pool.query('SELECT id, email, name FROM users');
    const users = result.rows;
    
    console.log(`Encontrados ${users.length} usuários:`);
    
    for (const user of users) {
      // Gerar senha simples baseada no email (parte antes do @)
      const simplePassword = user.email.split('@')[0] + '123';
      const hashedPassword = await bcrypt.hash(simplePassword, 10);
      
      // Atualizar senha
      await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, user.id]
      );
      
      console.log(`✅ ${user.name} (${user.email}) -> Senha: ${simplePassword}`);
    }
    
    console.log('\n✨ Senhas resetadas com sucesso!');
    console.log('📝 Use as senhas mostradas acima para fazer login.');
    
  } catch (error) {
    console.error('Erro ao resetar senhas:', error);
  } finally {
    await pool.end();
  }
}

resetPasswords();