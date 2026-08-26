-- Seed data para PostgreSQL

-- Criar usuário admin (senha: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Administrador', 'admin@xp.com', '$2b$10$sYCp27VIvkv8hyofD1mHg.O9wtL5HxuoPxK7mfmpBes64.R7vUzKC', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$sYCp27VIvkv8hyofD1mHg.O9wtL5HxuoPxK7mfmpBes64.R7vUzKC', role = 'ADMIN';

-- Criar matérias
INSERT INTO subjects (name) VALUES 
('Matemática'), ('Português'), ('História'), ('Geografia'), 
('Ciências'), ('Inglês'), ('Educação Financeira')
ON CONFLICT (name) DO NOTHING;

-- Criar conquistas
INSERT INTO achievements (name, description, icon, type, requirement) VALUES 
('Primeira Atividade', 'Complete sua primeira atividade', '🏆', 'FIRST_ACTIVITY', 1),
('Primeira Prova', 'Realize sua primeira prova', '📝', 'FIRST_QUIZ', 1),
('10 Quizzes', 'Responda 10 quizzes', '🎯', 'QUIZ_COUNT', 10),
('50 Quizzes', 'Responda 50 quizzes', '🌟', 'QUIZ_COUNT', 50),
('Top 10', 'Esteja entre os 10 primeiros do ranking', '🥇', 'RANKING', 10),
('Top 3', 'Esteja entre os 3 primeiros do ranking', '🏅', 'RANKING', 3),
('Sequência de 7 dias', 'Estude por 7 dias consecutivos', '🔥', 'STREAK', 7),
('Sequência de 30 dias', 'Estude por 30 dias consecutivos', '💎', 'STREAK', 30)
ON CONFLICT (name) DO NOTHING;

-- Criar quizzes de exemplo
-- Matemática Básica
INSERT INTO quizzes (title, description, subject_id) 
VALUES ('Matemática Básica', 'Teste seus conhecimentos em matemática básica', 
(SELECT id FROM subjects WHERE name = 'Matemática' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Geometria Básica
INSERT INTO quizzes (title, description, subject_id) 
VALUES ('Geometria Básica', 'Questões sobre figuras geométricas', 
(SELECT id FROM subjects WHERE name = 'Matemática' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Gramática Básica
INSERT INTO quizzes (title, description, subject_id) 
VALUES ('Gramática Básica', 'Teste seus conhecimentos em gramática', 
(SELECT id FROM subjects WHERE name = 'Português' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Adicionar questões (você precisará ajustar os IDs dos quizzes após inserir)
-- Exemplo:
-- INSERT INTO questions (quiz_id, text, option_a, option_b, option_c, option_d, correct_option, explanation, xp_reward)
-- VALUES (1, 'Quanto é 2 + 2?', '3', '4', '5', '6', 'B', '2 + 2 = 4', 10);
