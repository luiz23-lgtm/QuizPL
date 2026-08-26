import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import type { Quiz, Subject } from '../types';
import { BookOpen, Star, CheckCircle2, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes] = await Promise.all([
          api.get('/quizzes'),
        ]);
        setQuizzes(quizzesRes.data);
        const uniqueSubjects = Array.from(
          new Map(quizzesRes.data.map((q: Quiz) => [q.subject.id, q.subject])).values()
        );
        setSubjects(uniqueSubjects as Subject[]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuizzes = selectedSubject
    ? quizzes.filter((q) => q.subject.id === parseInt(selectedSubject))
    : quizzes;

  const calculateXpProgress = (xp: number) => {
    const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

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
          className="mb-6 sm:mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-blue-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                  Olá, {user?.name}!
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">Continue sua jornada de aprendizado</p>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl sm:text-4xl font-bold mb-1">Nível {user?.level}</div>
                <div className="text-blue-100 text-sm sm:text-base">{user?.xp} XP</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${calculateXpProgress(user?.xp || 0)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total de Quizzes</p>
                <p className="text-2xl font-bold text-white">{quizzes.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Concluídos</p>
                <p className="text-2xl font-bold text-white">
                  {user?.quizzesCompleted?.length || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Conquistas</p>
                <p className="text-2xl font-bold text-white">
                  {user?.userAchievements?.length || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subject Filter */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Matérias</h2>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap transition font-semibold text-sm sm:text-base ${
                !selectedSubject
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-white/10'
              }`}
            >
              Todas
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id.toString())}
                className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap transition font-semibold text-sm sm:text-base ${
                  selectedSubject === subject.id.toString()
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-white/10'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quizzes Grid */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Quizzes disponíveis</h2>
          {filteredQuizzes.length === 0 ? (
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-white font-medium">Nenhum quiz disponível</p>
              <p className="text-slate-400 text-sm mt-1">Tente outro filtro de matéria</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredQuizzes.map((quiz, index) => {
             const isCompleted = quiz.completions?.length > 0;
             return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/quiz/${quiz.id}`}
                  className={`block relative bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl hover:shadow-blue-500/20 transition group ${
                    isCompleted ? 'opacity-75' : ''
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute top-4 right-4 z-10">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                  
                  {quiz.imageUrl && !imageErrors[quiz.id] && (
                    <div className="relative h-40 rounded-t-3xl overflow-hidden">
                      <img 
                        src={quiz.imageUrl} 
                        alt={quiz.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImageErrors(prev => ({ ...prev, [quiz.id]: true }))}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>
                  )}
                  {quiz.imageUrl && imageErrors[quiz.id] && (
                    <div className="relative h-40 rounded-t-3xl overflow-hidden bg-slate-700/50 flex items-center justify-center">
                      <div className="text-slate-400 text-sm">Imagem não disponível</div>
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full">
                        {quiz.subject.name}
                      </span>
                      {isCompleted && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                          Concluído
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
                    {quiz.description && (
                      <p className="text-slate-400 text-sm mb-4">{quiz.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.questions.length} questões</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>
                          {quiz.questions.reduce((sum, q) => sum + q.xpReward, 0)} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          </div>
          )}
        </div>
    </div>
  );
};

export default Home;
