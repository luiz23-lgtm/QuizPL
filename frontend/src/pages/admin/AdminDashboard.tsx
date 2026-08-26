import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import {
  Users,
  FileText,
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalUsers: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalAnswers: number;
}

interface RecentQuiz {
  id: number;
  title: string;
  subject?: { name: string };
  published: boolean;
  createdAt: string;
  questions?: { length: number }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    totalAnswers: 0,
  });
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, subjectsRes, quizzesRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/subjects'),
          api.get('/admin/quizzes'),
        ]);
        setStats(statsRes.data);
        setTotalSubjects(subjectsRes.data.length);
        setRecentQuizzes(quizzesRes.data.slice(0, 5));
      } catch (error) {
        console.error('Falha ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total de usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total de quizzes',
      value: stats.totalQuizzes,
      icon: FileText,
      color: 'green',
    },
    {
      title: 'Total de matérias',
      value: totalSubjects,
      icon: BookOpen,
      color: 'purple',
    },
    {
      title: 'Respostas enviadas',
      value: stats.totalAnswers,
      icon: CheckCircle2,
      color: 'amber',
    },
  ];

  const iconColors: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };

  const activityBars = [
    { label: 'Seg', height: 45, color: 'bg-blue-500' },
    { label: 'Ter', height: 72, color: 'bg-indigo-500' },
    { label: 'Qua', height: 58, color: 'bg-blue-400' },
    { label: 'Qui', height: 90, color: 'bg-indigo-600' },
    { label: 'Sex', height: 65, color: 'bg-blue-500' },
    { label: 'Sáb', height: 40, color: 'bg-slate-500' },
    { label: 'Dom', height: 55, color: 'bg-indigo-400' },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400">Visão geral do QuizMaster</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${iconColors[card.color]}`}
                  >
                    <card.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-400 truncate">{card.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{card.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Gráfico simulado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Atividade recente</h2>
              <span className="text-xs text-slate-500 ml-auto">últimos 7 dias</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {activityBars.map((bar, i) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.height}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    className={`w-full max-w-10 rounded-t-lg ${bar.color} opacity-80 min-h-[4px]`}
                  />
                  <span className="text-xs text-slate-500">{bar.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Dados ilustrativos — integração com analytics em breve
            </p>
          </motion.div>

          {/* Últimos quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Quizzes recentes</h2>
              <Link
                to="/admin/quizzes/new"
                className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                title="Criar quiz"
              >
                <Plus className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-700/30 border border-white/5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white text-sm truncate">{quiz.title}</p>
                      <p className="text-xs text-slate-400">
                        {quiz.subject?.name || 'Sem matéria'} ·{' '}
                        {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                        quiz.published
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-600/50 text-slate-400'
                      }`}
                    >
                      {quiz.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-slate-400 text-sm text-center py-6">Nenhum quiz criado ainda</p>
              )}
            </div>
            <Link
              to="/admin/quizzes"
              className="block mt-4 text-center text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              Ver todos os quizzes →
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-slate-800/40 rounded-2xl p-4 border border-white/5"
        >
          <p className="text-sm text-slate-400">
            <span className="text-blue-400 font-medium">{stats.totalQuestions}</span> questões
            cadastradas no sistema
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
