-- Criar banco de dados
-- CREATE DATABASE quiz_db;

-- Tabelas
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    avatar TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    subject_id INTEGER REFERENCES subjects(id),
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    image_url TEXT,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option VARCHAR(1) NOT NULL,
    explanation TEXT,
    xp_reward INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER REFERENCES questions(id),
    selected_option VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

CREATE TABLE IF NOT EXISTS quiz_completions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    quiz_id INTEGER REFERENCES quizzes(id),
    score INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quiz_id)
);

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    requirement INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    achievement_id INTEGER REFERENCES achievements(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS xp_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_completions_user_id ON quiz_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_completions_quiz_id ON quiz_completions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject_id ON quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_xp_history_user_id ON xp_history(user_id);


-- BANCO DE DADOS POPULADO

-- Tabela users
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (11, 'Teoh', 'teoh@gmail.com', '$2b$10$KOwnjMhnJv6P9EQm13cXZ.mk/W73H4A.mp7XgEvXkZQ1BgUefWRyu', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (12, 'Guilherme', 'guilherme@gmail.com', '$2b$10$tnEwcSWVuRzeQgu1nCQ6y.mmftUQDvNKvE.Jwdn8ZKDYUYu90Nigq', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (14, 'Joadson', 'joadson@gmail.com', '$2b$10$Uxnh6Oj6Gc0M9KAHlYnUs.LMU1roskA2619FRDMjpttWrhwl39LcC', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (15, 'Jonatam', 'jonatam@gmail.com', '$2b$10$NVGtRsPRhoKDjeDI32mOIevBSv2gCjqXa.S/3V2.SqAxo.osZ.Cay', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (2, 'Luiz otavio Souza De oliveira', 'oliveiraotavioluiz2@gmail.com', '$2b$10$tl8LHQBP0ohNTjUIRChrtOaTiM30iTUPrKUko.EJNHkcwWhB/CCwS', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T00:46:09.147Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (16, 'Janatas', 'janatas@gmail.com', '$2b$10$9jJSZEsFln7nHFhbqVBGyuPgLQg0pwZwuaAYqAbpCIzcXtIJaqSPq', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (17, 'Eduardo Pina', 'eduardopina@gmail.com', '$2b$10$JuXRZo/mHpLZ37OAhO9a9.uZu2z7jqgMcmMetFJAQqEklpyHKS4Iq', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (18, 'Eduardo Silva', 'eduardosilva@gmail.com', '$2b$10$1HrQkTl9Wv02B5FdFDhzAeCeBAE5NCvX9jQZYLBbG8kkyymyEau8C', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (19, 'Paulo', 'paulo@gmail.com', '$2b$10$LoH6onjqrRdcCQqzI5U08.x2XNZFq58v4wKIvaZkUyFj5akvZgY0O', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (20, 'Felipe Manuela', 'felipemanuela@gmail.com', '$2b$10$fsEO04vPQtKBa4wv6QzrTuYnxkH6O91mSr/1ECKjubc/Crfn2D.wq', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (21, 'Murilo', 'murilo@gmail.com', '$2b$10$lFTqla9SYaUupyH8.9VSZ.krHviq5Qkktne38gVWJ5JD1tCLBz9.m', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (22, 'Davi', 'davi@gmail.com', '$2b$10$rHjW20f7NltYee85pzeCyOvC8LA3AaJbN9q3rM/CbDovshJgVjAZu', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (4, 'Amanda', 'amanda@gmail.com', '$2b$10$cAGfOVwjkNcSYN457nDU7OABfP6QDFxnnLPlXk6e1t9vHw7qOCo3e', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (5, 'Ana Livia', 'analivia@gmail.com', '$2b$10$Lutmc0/ReMU3A4PGxDjyJOqJj3mcCag.yUx./iggiAfXzaiSnAULe', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (6, 'Beatriz', 'beatriz@gmail.com', '$2b$10$Kn6Ku.UDB9SLYSAK4fMeOeRuXbPF1CCErzk/xbaWkkftCbia739NG', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (7, 'Carolina', 'carolina@gmail.com', '$2b$10$ZuamZjoHcm47eEmjqwILt.kp4Z6KLLFGa1MKwgvEq2gNMPaAFGl62', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (8, 'Gabriela', 'gabriela@gmail.com', '$2b$10$SEfnzFpiZ147A9wdeczgDeINJ9x1s8A0otbgGiTwL7iZnYr0QMRdq', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (9, 'Maria Julia', 'mariajulia@gmail.com', '$2b$10$VDe1QyOk/jeesafEk5O1YuTe6ATix/.sLplNtNIgFlIijsRhw9whW', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (10, 'Luiz Otavio', 'luizotavio@gmail.com', '$2b$10$LpFBPA.vKzRCBzLzV9QzVeMAyCULDlyf7W8wbSKPA.DsBl/hsMOxy', 'USER', NULL, 0, 1, 0, '2026-08-26T20:25:30.352Z', '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (13, 'Yuri', 'yuri@gmail.com', '$2b$10$CUqMsMGHp4puQNtfwvTsFO6h1jtLF/TSUvglM.5dbdd/0zlZidOCa', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (236, 'Pedro', 'pedro@gmail.com', '$2b$10$ICHnkeCP1K4o2IsWbFZ4k.v62V9EzV6hH.NvprP7tMFLUHHl5e3nS', 'USER', NULL, 0, 1, 0, NULL, '2026-08-26T21:28:12.714Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (1, 'Administrador', 'admin@xp.com', '$2b$10$QAQgIZjj2oEH/y0MyASew.8c.EMXzG6UOrLyntNeqc2hjZe/ugLX6', 'ADMIN', NULL, 10, 1, 0, '2026-08-26T19:58:50.087Z', '2026-06-08T23:18:23.311Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (23, 'Maria Eduarda', 'mariaeduarda@gmail.com', '$2b$10$QGJXV8hCZybd6SCMOHmB7eZ226ofWld87uKCd18FGDOM8fanA4Ol.', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (24, 'Gabrielle', 'gabrielle@gmail.com', '$2b$10$FEycp/QHGsAXT69J6sjwcu9/6ghkDNa5OgDPOCzDJfi3HHkoCc2si', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (25, 'Isabelly', 'isabelly@gmail.com', '$2b$10$N/zF/fzayuUw4bmkCXPIjuS1FjkLCZxxUxW0MobbBsjMJcRpI/Vja', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (26, 'Isabela', 'isabela@gmail.com', '$2b$10$esWwZjRXzqpK0y6IwAFGau63yDiqd9kQkE8/.m8NL9nswGLBuw1Dm', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (27, 'Maria Fernanda', 'mariafernanda@gmail.com', '$2b$10$PIY2TEHDHKtyH/A4xEQWQOmHc7GyQhrKYhhQxH0qGgYcUY3d7Lf8C', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (28, 'Sofia', 'sofia@gmail.com', '$2b$10$xKNIQbF3Xes1q0BE6cp6q.HI71BJOW0fxcmXKyRhO/i6/xSeoLfRy', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (29, 'Joao Pedro', 'joaopedro@gmail.com', '$2b$10$xGLDhtTQ9QSjbc7j4RQjBuDhJxHFGrPxLr5m8N0b0NxTONuPXzbUO', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (31, 'Joao Miguel', 'joaomiguel@gmail.com', '$2b$10$CUjMtMYu4hGDAYEjH/4GkOL3WSTZZsc.I/yOoKBTUN1wZoBAwInRy', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password, role, avatar, xp, level, streak, last_activity_date, created_at) VALUES (32, 'Mario', 'mario@gmail.com', '$2b$10$edOr1QFleHXCaqgqoY95U.rzdKYWH44IIREJ614aicz3CYkDx18oq', 'USER', NULL, 0, 1, 0, NULL, '2026-06-10T01:27:25.107Z') ON CONFLICT DO NOTHING;

-- Tabela subjects
INSERT INTO subjects (id, name) VALUES (1, 'Matemática') ON CONFLICT DO NOTHING;
INSERT INTO subjects (id, name) VALUES (2, 'Português') ON CONFLICT DO NOTHING;
INSERT INTO subjects (id, name) VALUES (16, 'Geografia') ON CONFLICT DO NOTHING;
INSERT INTO subjects (id, name) VALUES (17, 'História') ON CONFLICT DO NOTHING;
INSERT INTO subjects (id, name) VALUES (18, 'Ciências') ON CONFLICT DO NOTHING;

-- Tabela quizzes
INSERT INTO quizzes (id, title, description, image_url, subject_id, published, created_at) VALUES (7, 'Quiz de Álgebra: Desafio das Equações', '🧠 Bem-vindo ao Desafio de Álgebra!

Teste seus conhecimentos resolvendo equações e encontrando o valor da incógnita x. Este quiz foi criado para ajudar estudantes a praticarem conceitos básicos de álgebra de forma rápida e divertida. Cada questão apresenta uma equação que exige raciocínio lógico e atenção aos cálculos.

🎯 Objetivo: Resolver as equações e descobrir o valor correto de x.

📚 Nível: Básico a intermediário.

🏆 Desafio: Acerte o maior número de questões possível e prove que você é um verdadeiro mestre da álgebra!', '', 1, true, '2026-06-10T02:02:11.762Z') ON CONFLICT DO NOTHING;
INSERT INTO quizzes (id, title, description, image_url, subject_id, published, created_at) VALUES (8, 'matematica', 'faça a parte de de uam conta', '', 1, true, '2026-08-26T19:59:21.655Z') ON CONFLICT DO NOTHING;

-- Tabela questions
INSERT INTO questions (id, quiz_id, text, image_url, option_a, option_b, option_c, option_d, correct_option, explanation, xp_reward) VALUES (5, 7, '', '', '', '', '', '', 'A', '', 10) ON CONFLICT DO NOTHING;
INSERT INTO questions (id, quiz_id, text, image_url, option_a, option_b, option_c, option_d, correct_option, explanation, xp_reward) VALUES (6, 8, 'quanto é 10 + 10', '', '3', '10', '2', '20', 'B', '', 25) ON CONFLICT DO NOTHING;

-- Tabela achievements
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (1, 'Primeira Atividade', 'Complete sua primeira atividade', '🏆', 'FIRST_ACTIVITY', 1) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (2, 'Primeira Prova', 'Realize sua primeira prova', '📝', 'FIRST_QUIZ', 1) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (3, '10 Quizzes', 'Responda 10 quizzes', '🎯', 'QUIZ_COUNT', 10) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (4, '50 Quizzes', 'Responda 50 quizzes', '🌟', 'QUIZ_COUNT', 50) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (5, 'Top 10', 'Esteja entre os 10 primeiros do ranking', '🥇', 'RANKING', 10) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (6, 'Top 3', 'Esteja entre os 3 primeiros do ranking', '🏅', 'RANKING', 3) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (7, 'Sequência de 7 dias', 'Estude por 7 dias consecutivos', '🔥', 'STREAK', 7) ON CONFLICT DO NOTHING;
INSERT INTO achievements (id, name, description, icon, type, requirement) VALUES (8, 'Sequência de 30 dias', 'Estude por 30 dias consecutivos', '💎', 'STREAK', 30) ON CONFLICT DO NOTHING;

-- Tabela quiz_completions
INSERT INTO quiz_completions (id, user_id, quiz_id, score, completed_at) VALUES (1, 1, 7, 1, '2026-08-26T19:58:50.087Z') ON CONFLICT DO NOTHING;
INSERT INTO quiz_completions (id, user_id, quiz_id, score, completed_at) VALUES (2, 10, 8, 0, '2026-08-26T20:07:16.880Z') ON CONFLICT DO NOTHING;
INSERT INTO quiz_completions (id, user_id, quiz_id, score, completed_at) VALUES (3, 10, 7, 0, '2026-08-26T20:25:30.352Z') ON CONFLICT DO NOTHING;

-- Tabela user_achievements
INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (1, 1, 1, '2026-08-26T19:58:50.087Z') ON CONFLICT DO NOTHING;
INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (2, 1, 2, '2026-08-26T19:58:50.087Z') ON CONFLICT DO NOTHING;
INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (3, 10, 1, '2026-08-26T20:07:16.880Z') ON CONFLICT DO NOTHING;
INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (4, 10, 2, '2026-08-26T20:07:16.880Z') ON CONFLICT DO NOTHING;

-- Tabela xp_history
INSERT INTO xp_history (id, user_id, amount, reason, earned_at) VALUES (1, 1, 10, 'Completed quiz: Quiz de Álgebra: Desafio das Equações', '2026-08-26T19:58:50.087Z') ON CONFLICT DO NOTHING;
INSERT INTO xp_history (id, user_id, amount, reason, earned_at) VALUES (2, 10, 0, 'Completed quiz: matematica', '2026-08-26T20:07:16.880Z') ON CONFLICT DO NOTHING;
INSERT INTO xp_history (id, user_id, amount, reason, earned_at) VALUES (3, 10, 0, 'Completed quiz: Quiz de Álgebra: Desafio das Equações', '2026-08-26T20:25:30.352Z') ON CONFLICT DO NOTHING;

