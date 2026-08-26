import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/achievements');
        setAchievements(response.data);
      } catch (error) {
        console.error('Falha ao carregar conquistas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent =
    achievements.length > 0
      ? Math.round((unlockedCount / achievements.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Conquistas
              </h1>
              <p className="text-sm sm:text-base text-slate-400">
                Desbloqueie medalhas completando desafios
              </p>
            </div>
          </div>

          {/* Resumo de progresso */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-slate-400 text-sm">Seu progresso</p>
                <p className="text-white text-lg sm:text-xl font-bold">
                  <span className="text-blue-400">{unlockedCount}</span>
                  <span className="text-slate-500 font-normal"> / </span>
                  {achievements.length} conquistas
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <span className="text-2xl sm:text-3xl font-bold">{progressPercent}%</span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30"
              />
            </div>
          </motion.div>

          {/* Grid de conquistas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-2xl p-4 sm:p-6 border shadow-2xl overflow-hidden ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-500/15 via-slate-800/60 to-indigo-600/15 backdrop-blur-xl border-amber-500/30'
                    : 'bg-slate-800/40 backdrop-blur-xl border-white/5 opacity-80'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                )}

                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-4 ${
                    achievement.unlocked
                      ? 'bg-amber-500/20 ring-2 ring-amber-500/40'
                      : 'bg-slate-700/50 grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>

                <h3
                  className={`text-base sm:text-lg font-bold mb-2 ${
                    achievement.unlocked ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {achievement.name}
                </h3>

                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    achievement.unlocked ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {achievement.description}
                </p>

                {achievement.unlocked ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Desbloqueada!</span>
                    {achievement.unlockedAt && (
                      <span className="text-slate-500 text-xs ml-auto hidden sm:inline">
                        {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>Bloqueada</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {achievements.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center"
            >
              <Award className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-white font-medium">Nenhuma conquista disponível</p>
              <p className="text-slate-400 text-sm mt-1">Volte em breve para novos desafios!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements;
