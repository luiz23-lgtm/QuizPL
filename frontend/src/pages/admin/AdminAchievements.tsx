import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Award, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  requirement: number;
  _count?: { userAchievements: number };
}

const AdminAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/admin/achievements');
        setAchievements(response.data);
      } catch (error) {
        console.error('Falha ao carregar conquistas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleAction = (action: string, achievement?: Achievement) => {
    const name = achievement?.name || 'nova conquista';
    alert(`${action}: ${name}\n(Funcionalidade simulada — API em breve)`);
  };

  const typeLabels: Record<string, string> = {
    QUIZ_COUNT: 'Quizzes completados',
    STREAK: 'Sequência de dias',
    RANKING: 'Posição no ranking',
    XP: 'Pontos de XP',
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Conquistas</h1>
              <p className="text-sm text-slate-400">Gerencie medalhas e desafios</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('Criar')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            Nova conquista
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl sm:text-5xl">{achievement.icon}</div>
                  <div className="flex gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAction('Editar', achievement)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAction('Excluir', achievement)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {achievement.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex-1">{achievement.description}</p>
                <div className="space-y-2 pt-3 border-t border-white/10 text-sm">
                  <p className="text-slate-500">
                    Tipo:{' '}
                    <span className="text-slate-300">
                      {typeLabels[achievement.type] || achievement.type}
                    </span>
                  </p>
                  <p className="text-slate-500">
                    Requisito:{' '}
                    <span className="text-blue-400 font-medium">{achievement.requirement}</span>
                  </p>
                  <p className="flex items-center gap-1 text-emerald-400">
                    <Users className="w-4 h-4" />
                    {achievement._count?.userAchievements || 0} desbloqueios
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAchievements;
