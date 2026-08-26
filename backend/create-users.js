const bcrypt = require('bcrypt');

const users = [
  { name: 'Amanda', email: 'amanda@gmail.com', password: 'amanda123' },
  { name: 'Ana Livia', email: 'analivia@gmail.com', password: 'analivia123' },
  { name: 'Beatriz', email: 'beatriz@gmail.com', password: 'beatriz123' },
  { name: 'Carolina', email: 'carolina@gmail.com', password: 'carolina123' },
  { name: 'Gabriela', email: 'gabriela@gmail.com', password: 'gabriela123' },
  { name: 'Maria Julia', email: 'mariajulia@gmail.com', password: 'mariajulia123' },
  { name: 'Luiz Otavio', email: 'luizotavio@gmail.com', password: 'luizotavio123' },
  { name: 'Teoh', email: 'teoh@gmail.com', password: 'teoh123' },
  { name: 'Guilherme', email: 'guilherme@gmail.com', password: 'guilherme123' },
  { name: 'Yuri Pedro', email: 'yuripedro@gmail.com', password: 'yuripedro123' },
  { name: 'Joadson', email: 'joadson@gmail.com', password: 'joadson123' },
  { name: 'Jonatas', email: 'jonatas1@gmail.com', password: 'jonatas123' },
  { name: 'Jonatas', email: 'jonatas2@gmail.com', password: 'jonatas123' },
  { name: 'Eduardo Pina', email: 'eduardopina@gmail.com', password: 'eduardopina123' },
  { name: 'Eduardo Silva', email: 'eduardosilva@gmail.com', password: 'eduardosilva123' },
  { name: 'Paulo', email: 'paulo@gmail.com', password: 'paulo123' },
  { name: 'Felipe', email: 'felipe@gmail.com', password: 'felipe123' },
  { name: 'Manuela', email: 'manuela@gmail.com', password: 'manuela123' },
  { name: 'Murilo', email: 'murilo@gmail.com', password: 'murilo123' },
  { name: 'Davi', email: 'davi@gmail.com', password: 'davi123' },
  { name: 'Maria Eduarda', email: 'mariaeduarda@gmail.com', password: 'mariaeduarda123' },
  { name: 'Gabrielle', email: 'gabrielle@gmail.com', password: 'gabrielle123' },
  { name: 'Isabelly', email: 'isabelly@gmail.com', password: 'isabelly123' },
  { name: 'Isabela', email: 'isabela@gmail.com', password: 'isabela123' },
  { name: 'Maria Fernanda', email: 'mariafernanda@gmail.com', password: 'mariafernanda123' },
  { name: 'Sofia', email: 'sofia@gmail.com', password: 'sofia123' },
  { name: 'Joao Pedro', email: 'joaopedro@gmail.com', password: 'joaopedro123' },
  { name: 'Eveline', email: 'eveline@gmail.com', password: 'eveline123' },
  { name: 'Joao Miguel', email: 'joaomiguel@gmail.com', password: 'joaomiguel123' },
  { name: 'Mario', email: 'mario@gmail.com', password: 'mario123' },
];

const saltRounds = 10;

console.log('-- SQL para inserir usuários\n');

users.forEach(user => {
  const hash = bcrypt.hashSync(user.password, saltRounds);
  console.log(`INSERT INTO users (name, email, password, role) VALUES ('${user.name}', '${user.email}', '${hash}', 'USER') ON CONFLICT (email) DO UPDATE SET password = '${hash}';`);
});
