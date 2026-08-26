const bcrypt = require('bcrypt');

// Gerar hash para senha "admin123"
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('Hash para senha "admin123":');
  console.log(hash);
  console.log('\nSQL para inserir/atualizar admin:');
  console.log(`INSERT INTO users (name, email, password, role) VALUES ('Administrador', 'admin@xp.com', '${hash}', 'ADMIN') ON CONFLICT (email) DO UPDATE SET password = '${hash}', role = 'ADMIN';`);
});
