import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Zap,
  Mail,
  Flame,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RankingUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  role: string;
  userAchievements?: unknown[];
  quizzesCompleted?: number;
  _count?: { quizzesCompleted: number };
  count?: { quizzesCompleted: number };
}

const AdminRanking: React.FC = () => {
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const getQuizzesCount = (user: RankingUser) =>
    user.quizzesCompleted ?? user._count?.quizzesCompleted ?? user.count?.quizzesCompleted ?? 0;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get('/admin/ranking');
        setUsers(response.data);
      } catch (error) {
        console.error('Falha ao carregar ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-slate-300" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return (
          <span className="text-xl font-bold text-slate-400 w-8 text-center">#{rank}</span>
        );
    }
  };

  const UserAvatar = ({ user, size = 'w-14 h-14' }: { user: RankingUser; size?: string }) => (
    <div className={`${size} rounded-full flex-shrink-0 overflow-hidden ring-2 ring-blue-500/30`}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );

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

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Ranking completo
            </h1>
            <p className="text-sm text-slate-400">Visão detalhada para administradores</p>
          </div>
        </div>

        {top3.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Top 3
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3.map((user, index) => {
                const rank = index + 1;
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl text-center"
                  >
                    <div className="flex justify-center mb-2">{getRankIcon(rank)}</div>
                    <div className="flex justify-center mb-3">
                      <UserAvatar user={user} size="w-16 h-16" />
                    </div>
                    <h3 className="font-bold text-white truncate">{user.name}</h3>
                    <p className="text-xs text-slate-400 truncate flex items-center justify-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                      <span className="text-blue-400 font-bold">{user.xp} XP</span>
                      <span className="text-slate-400">Nív. {user.level}</span>
                      {user.role === 'ADMIN' && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white mb-2">Todos os jogadores</h2>
          {rest.map((user, index) => {
            const rank = index + 4;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ x: 4 }}
                className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-8 flex justify-center flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>
                    <UserAvatar user={user} size="w-12 h-12 sm:w-14 sm:h-14" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white truncate">{user.name}</h3>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {user.email}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-400">
                        <span>Nível {user.level}</span>
                        {user.role === 'ADMIN' && (
                          <span className="text-purple-400">Admin</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 text-sm border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="flex items-center gap-1 text-blue-400 font-bold">
                      <Zap className="w-4 h-4" />
                      {user.xp} XP
                    </div>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Flame className="w-4 h-4" />
                      {user.streak} dias
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <BookOpen className="w-4 h-4" />
                      {getQuizzesCount(user)} quizzes
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Award className="w-4 h-4" />
                      {user.userAchievements?.length || 0} conquistas
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {users.length === 0 && (
          <p className="text-center text-slate-400 py-12">Nenhum usuário no ranking</p>
        )}
      </motion.div>
    </div>
  );
};

export default AdminRanking;
