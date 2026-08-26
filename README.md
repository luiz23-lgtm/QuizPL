# 🎯 QuizSala — Gamificação para Prova Paulista

> Plataforma completa de quiz gamificado feita para salas de aula, com sistema de níveis, XP, ranking, conquistas e painel administrativo. **100% gratuita para rodar.**

---

## ✨ Principais Funcionalidades

### 👨‍🎓 Para alunos
- ✅ Login com email + senha
- ✅ Realizar quizzes de múltipla escolha (alternativas **UM / DOIS / TRÊS / QUATRO**)
- ✅ Feedback instantâneo: acerto verde 🌳 ou erro vermelho ❌ com explicação
- ✅ Sistema de **XP + Níveis** por acerto
- ✅ Ranking com TOP 3 (medalhas 🥇🥈🥉)
- ✅ Conquistas para desbloquear
- ✅ Perfil pessoal com estatísticas
- ✅ **100% responsivo** (funciona no celular e tablet dos alunos!)

### 👨‍🏫 Para professores / administradores
- ✅ Painel admin com estatísticas rápidas
- ✅ **Criar e gerenciar usuários** (alunos ou outros admins)
- ✅ Criar matérias (ex: Matemática, Português, História, etc.)
- ✅ Criar quizzes ilimitados com capa
- ✅ Adicionar questões com:
  - Pergunta + imagem opcional
  - 4 alternativas
  - Explicação da resposta
  - XP de recompensa por questão
- ✅ Publicar / ocultar quizzes
- ✅ Ver ranking completo dos alunos

---

## 🛠️ Tecnologias

| Camada       | Tecnologia                  |
|--------------|-----------------------------|
| Frontend     | React 19 + TypeScript + Vite |
| Estilo       | Tailwind CSS + Framer Motion |
| Ícones       | Lucide React                 |
| Backend      | Node.js + Express + TypeScript |
| Banco de dados | PostgreSQL (via Supabase) |
| Autenticação | JWT                          |
| Senhas       | bcrypt                       |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ (recomendado LTS)
- npm ou yarn

### Passo 1 — Instalar dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Passo 2 — Configurar o banco de dados
1. Abra o arquivo `backend/.env`
2. Cole sua **string de conexão PostgreSQL** (veja o guia de hospedagem gratuita abaixo):
```env
DATABASE_URL=postgres://usuario:senha@host:5432/nome_do_banco
JWT_SECRET=uma-senha-super-secreta-aqui
PORT=3001
```
3. Se precisar recriar as tabelas, execute o SQL de `backend/database.sql` no seu banco.

### Passo 3 — Subir os dois projetos
```bash
# Terminal 1 — Backend (porta 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (porta 5173)
cd frontend
npm run dev
```
Pronto! Acesse **http://localhost:5173**

---

## 🔑 Usuário Admin padrão
> Crie este usuário manualmente ou use o script `backend/create-admin.js`:
- 📧 Email: `admin@xp.com`
- 🔑 Senha: `Admin123`

---

## ☁️ Hospedagem 100% Gratuita

### 🗄️ Banco de Dados — Supabase (Grátis)
1. Acesse https://supabase.com e crie uma conta
2. Clique em **New Project** → escolha a região mais perto de você
3. Depois de criado, vá em **Project Settings → Database**
4. Copie a **Connection String (URI)** e cole em `backend/.env` como `DATABASE_URL`
5. Abra o **SQL Editor** no Supabase, cole o conteúdo de `backend/database.sql` e rode **Run**
6. (Opcional) Rode o arquivo `backend/seed.sql` para já vir com alguns dados de exemplo

> Limite grátis do Supabase: **500MB de banco + 2GB de banda/mês** (MUITO para uma sala de aula).

---

### ⚙️ Backend — Render (Grátis)
1. Suba seu projeto no **GitHub** (público ou privado)
2. Acesse https://render.com → crie conta com GitHub
3. Clique em **"New +" → Web Service**
4. Selecione seu repositório
5. Preencha:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance**: Free (gratuito)
6. Em **Environment Variables**, adicione:
   - `DATABASE_URL` = a string do Supabase
   - `JWT_SECRET` = uma senha longa aleatória (ex: gere em https://generate-secret.vercel.app)
   - `NODE_ENV` = `production`
7. Clique em **Create Web Service** e aguarde ~2 minutos.

> Copie a URL do backend (ex: `https://meu-quiz-backend.onrender.com`) — você vai precisar dela no frontend.

---

### 💻 Frontend — Vercel (Grátis)
1. No mesmo projeto GitHub...
2. Acesse https://vercel.com → crie conta com GitHub
3. Clique em **Add New → Project** → selecione seu repositório
4. Configure **Root Directory**: `frontend`
5. Em **Environment Variables**, adicione:
   - `VITE_API_URL` = a URL do seu backend no Render (**com /api no final** se quiser usar proxy, ou a URL completa)
   - Exemplo: `VITE_API_URL=https://meu-quiz-backend.onrender.com`
6. Clique em **Deploy**.

Pronto! Você terá uma URL tipo `https://quizesala.vercel.app` para compartilhar com a sala 🎉

---

## 🧪 Checklist de Teste — Antes de Lançar para a Sala

Marque todos os itens antes de mandar o link pros alunos:

### 🔐 Autenticação
- [ ] Login com usuário admin funciona
- [ ] Login com usuário aluno funciona
- [ ] Tentativa com senha errada mostra erro corretamente
- [ ] Sair da conta volta para tela de login
- [ ] Usuário normal NÃO consegue acessar `/admin`
- [ ] Admin consegue acessar `/admin/users/new` e criar novo aluno

### 📝 Quizzes
- [ ] Admin cria uma matéria nova
- [ ] Admin cria um quiz novo (com capa, publicada)
- [ ] Admin adiciona pelo menos 2 questões (com explicação)
- [ ] O quiz aparece na tela inicial dos usuários
- [ ] Usuário abre o quiz e vê:
  - [ ] Alternativas UM / DOIS / TRÊS / QUATRO com texto completo
  - [ ] Acertando mostra banner verde e explicação
  - [ ] Errando mostra banner vermelho com a resposta correta
  - [ ] Só pode escolher UMA alternativa por questão
- [ ] Ao terminar, aparece o resultado com XP + nível + conquistas
- [ ] Ranking atualiza com o novo XP

### 📱 Responsividade (CELULAR É O MAIS IMPORTANTE!)
- [ ] Tela de login abre correta no celular
- [ ] Botões dos quizzes não ficam cortados
- [ ] Alternativas UM/DOIS/TRÊS/QUATRO cabem na tela
- [ ] Ranking não quebra em telas pequenas
- [ ] Painel admin é usável no celular (mesmo que rolável)

### ☁️ Produção (depois de hospedar)
- [ ] URL do Vercel abre de qualquer celular
- [ ] Login funciona na URL pública (erro de CORS? Configure `cors` no backend!)
- [ ] Quiz carrega e salva respostas corretamente
- [ ] Imagens de quizzes/questões carregam

### 💡 Dica final: teste com um usuário aluno!
Crie uma conta teste com email/senha fáceis, e faça **todo o caminho** do aluno — do login ao término do quiz. Qualquer bug aparece assim. 😊

---

## 📁 Estrutura de Pastas
```
quize-sala-prova-paulista/
├── backend/
│   ├── src/
│   │   ├── routes/          # API REST (auth, users, quizzes, admin)
│   │   ├── middleware/      # Autenticação JWT
│   │   ├── lib/             # Conexão com banco
│   │   └── index.ts         # Entrada do servidor
│   └── database.sql         # Schema do banco
│
└── frontend/
    └── src/
        ├── pages/           # Login, Home, Quiz, Ranking, Admin...
        ├── components/      # Layout admin e usuário
        ├── contexts/        # AuthContext global
        └── lib/             # Axios (API) + helpers
```

---

## 🆘 Problemas Comuns

**CORS bloqueando requisição no navegador?**
No backend em `src/index.ts`, certifique-se que o `cors()` está sem restrição ou permita a URL do Vercel:
```ts
app.use(cors({ origin: ['https://seu-site.vercel.app', 'http://localhost:5173'] }));
```

**Render dormindo?** (plano grátis dorme após 15min inativo)
- Use https://cron-job.org para fazer um GET a cada 10min no seu backend → ele continua acordado.

**Supabase desligou?**
- Conta gratuita pausa após 7 dias sem uso. Basta logar no Supabase e clicar em **Restore Project**.

---

**Feito com ❤️ para salas de aula. Boa prova, paulista!**
