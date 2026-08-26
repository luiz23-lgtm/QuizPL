# 🚀 Guia Definitivo: Hospedagem 100% Gratuita do QuizMaster

Este guia passo a passo explica como colocar todo o sistema **QuizMaster** no ar de forma **100% gratuita**, utilizando os melhores serviços da atualidade:

- **GitHub**: Repositório do código fonte.
- **Neon.tech**: Banco de Dados PostgreSQL grátis em nuvem.
- **Render.com**: Hospedagem da API Backend (Node.js/Express).
- **Vercel**: Hospedagem da Aplicação Frontend (React/Vite).

---

## 📌 Passo 1: Subir o Projeto para o GitHub

1. Abra o terminal na raiz da pasta do seu projeto (`c:\react-projetos\quize-sala-prova-paulista`).
2. Inicialize o repositório Git e faça o commit inicial:

```bash
git init
git add .
git commit -m "feat: versão inicial pronta para deploy"
```

3. Acesse o seu [GitHub](https://github.com) e crie um novo repositório público ou privado (exemplo: `quiz-master`).
4. Vincule o repositório local e faça o push:

```bash
git remote add origin https://github.com/SEU_USUARIO/quiz-master.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Passo 2: Criar o Banco de Dados PostgreSQL Grátis (Neon.tech)

1. Acesse **[Neon.tech](https://neon.tech)** e crie uma conta gratuita com seu GitHub ou Google.
2. Clique em **"Create a Project"** e escolha o nome (ex: `quizmaster-db`).
3. Após criar, na tela principal você verá o **Connection Details**.
4. Copie a linha de conexão completa (`DATABASE_URL`). Ela terá este formato:
   ```text
   postgresql://seu_usuario:sua_senha@ep-exemplo.neon.tech/neondb?sslmode=require
   ```
5. Para popular a estrutura e os usuários do seu sistema no Neon:
   - Vá no menu lateral esquerdo do Neon e clique em **"SQL Editor"**.
   - Abra o arquivo [backend/full_backup.sql](file:///c:/react-projetos/quize-sala-prova-paulista/backend/full_backup.sql) do seu projeto, copie todo o texto SQL.
   - Cole no editor do Neon e clique em **"Run"**.
   - 🎯 Pronto! Todas as tabelas, perguntas, assuntos e usuários estão criados no banco em nuvem!

---

## ⚡ Passo 3: Hospedar o Backend no Render.com (Grátis)

1. Acesse **[Render.com](https://render.com)** e faça login com sua conta do GitHub.
2. Clique no botão **"New +"** no canto superior direito e selecione **"Web Service"**.
3. Conecte o repositório do seu projeto do GitHub (`quiz-master`).
4. Preencha as configurações do serviço:
   - **Name**: `quizmaster-api` (ou o nome que desejar)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
5. Vá na seção **Environment Variables** (Variáveis de Ambiente) e adicione:
   - `DATABASE_URL` $\rightarrow$ (Cole a URL completa do Neon.tech copiada no Passo 2)
   - `JWT_SECRET` $\rightarrow$ `seu_segredo_jwt_super_seguro_aqui`
   - `PORT` $\rightarrow$ `3001`
6. Clique em **"Create Web Service"**.
7. O Render fará o build e em instantes fornecerá a URL pública da sua API (ex: `https://quizmaster-api.onrender.com`).
8. Teste no navegador acessando `https://quizmaster-api.onrender.com/api/health` — deve retornar `{"status":"ok"}`!

---

## 🎨 Passo 4: Hospedar o Frontend na Vercel (Grátis)

1. Acesse **[Vercel.com](https://vercel.com)** e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** $\rightarrow$ **"Project"**.
3. Importe o repositório do seu projeto do GitHub (`quiz-master`).
4. Na tela de configuração do projeto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Clique em **Edit** e selecione a pasta `frontend`.
5. Abra a seção **Environment Variables** e adicione:
   - `VITE_API_URL` $\rightarrow$ `https://quizmaster-api.onrender.com/api` (substitua pela URL gerada no Render no Passo 3 + `/api`)
6. Clique em **"Deploy"**.
7. Em menos de 1 minuto, a Vercel gerará o link oficial do seu site no ar! 🎉 (ex: `https://quiz-master.vercel.app`).

---

## 🔐 Senhas de Acesso para Testar no Ar

Após o deploy, você poderá utilizar qualquer uma das contas cadastradas:

| Nome | E-mail | Senha | Função |
|------|--------|-------|--------|
| Administrador | `admin@xp.com` | `admin123` | 🛡️ Admin |
| Luiz | `oliveiraotavioluiz2@gmail.com` | `oliveiraotavioluiz2123` | 🎓 Aluno |
| Yuri | `yuri@gmail.com` | `yuri123` | 🎓 Aluno |
| Pedro | `pedro@gmail.com` | `pedro123` | 🎓 Aluno |

---

### 🎉 Parabéns!
Seu projeto estará rodando 100% online, de graça, com renovação contínua e atualização automática sempre que você fizer um `git push` no GitHub!
