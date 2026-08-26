# Quiz Backend - PostgreSQL

Este backend foi migrado do Prisma para PostgreSQL puro usando o pacote `pg`.

## Configuração do Banco de Dados

### 1. Instalar PostgreSQL
Certifique-se de ter o PostgreSQL instalado e rodando na sua máquina.

### 2. Criar Banco de Dados
```sql
CREATE DATABASE quiz_db;
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do backend com:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quiz_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

PORT=3001
JWT_SECRET=seu-secret-key-aqui
```

### 4. Executar Schema SQL
Execute o arquivo `database.sql` para criar as tabelas:

```bash
psql -U postgres -d quiz_db -f database.sql
```

Ou usando pgAdmin:
- Abra o pgAdmin
- Conecte ao servidor PostgreSQL
- Abra o banco de dados `quiz_db`
- Clique em Query Tool
- Cole o conteúdo de `database.sql`
- Execute

### 5. Executar Seed (Opcional)
Execute o arquivo `seed.sql` para inserir dados iniciais:

```bash
psql -U postgres -d quiz_db -f seed.sql
```

## Instalação e Execução

### 1. Instalar Dependências
```bash
npm install
```

### 2. Compilar TypeScript
```bash
npm run build
```

### 3. Rodar em Desenvolvimento
```bash
npm run dev
```

### 4. Rodar em Produção
```bash
npm start
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Usuários
- `GET /api/users/me` - Obter usuário atual
- `PUT /api/users/me` - Atualizar usuário atual

### Quizzes
- `GET /api/quizzes` - Listar quizzes
- `GET /api/quizzes/:id` - Obter quiz específico
- `POST /api/quizzes/:id/submit` - Submeter respostas do quiz

### Ranking
- `GET /api/ranking` - Obter ranking global

### Conquistas
- `GET /api/achievements` - Listar conquistas

### Admin
- `GET /api/admin/dashboard` - Dashboard admin
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/subjects` - Listar matérias
- `POST /api/admin/subjects` - Criar matéria
- `PUT /api/admin/subjects/:id` - Atualizar matéria
- `DELETE /api/admin/subjects/:id` - Deletar matéria
- `GET /api/admin/quizzes` - Listar quizzes
- `POST /api/admin/quizzes` - Criar quiz
- `PUT /api/admin/quizzes/:id` - Atualizar quiz
- `DELETE /api/admin/quizzes/:id` - Deletar quiz
- `GET /api/admin/questions/quiz/:quizId` - Listar questões de um quiz
- `POST /api/admin/questions` - Criar questão
- `PUT /api/admin/questions/:id` - Atualizar questão
- `DELETE /api/admin/questions/:id` - Deletar questão
- `GET /api/admin/achievements` - Listar conquistas
- `GET /api/admin/ranking` - Ranking admin

## Troubleshooting

### Erro de Conexão
Verifique se:
- PostgreSQL está rodando
- As credenciais no `.env` estão corretas
- O banco de dados `quiz_db` existe

### Erro de Schema
Execute o `database.sql` novamente para recriar as tabelas.

### Porta em Uso
Mude a porta no `.env` (PORT=3001) se a porta 3001 estiver em uso.
