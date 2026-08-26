import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Medal, Award, TrendingUp, Zap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface RankingUser {
  id: number;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  rank?: number;
  quizzesCompleted?: number;
  _count?: { quizzesCompleted: number };
  count?: { quizzesCompleted: number };
}

const Ranking: React.FC = () => {
  const { user: authUser } = useAuth();
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get('/ranking');
        setRanking(response.data.users || []);
        setCurrentUserRank(response.data.currentUserRank ?? null);
      } catch (error) {
        console.error('Falha ao carregar ranking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const getQuizzesCount = (user: RankingUser) =>
    user.quizzesCompleted ?? user._count?.quizzesCompleted ?? user.count?.quizzesCompleted ?? 0;

  const isUserMe = (user: RankingUser, rank: number) =>
    (authUser && Number(user.id) === Number(authUser.id)) ||
    (currentUserRank !== null && currentUserRank === rank);

  const getRankIcon = (rank: number, size = 'w-8 h-8') => {
    switch (rank) {
      case 1:
        return <Trophy className={`${size} text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]`} />;
      case 2:
        return <Medal className={`${size} text-slate-300`} />;
      case 3:
        return <Award className={`${size} text-amber-600`} />;
      default:
        return (
          <span className={`${size === 'w-8 h-8' ? 'text-xl' : 'text-lg'} font-bold text-slate-400 w-8 text-center flex items-center justify-center`}>
            {rank}
          </span>
        );
    }
  };

  const getPodiumStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          card: 'bg-gradient-to-b from-yellow-500/20 to-slate-800/60 border-yellow-500/40 ring-2 ring-yellow-500/30',
          avatar: 'ring-yellow-400 shadow-yellow-500/40',
          badge: 'bg-yellow-500/20 text-yellow-300',
          height: 'md:pt-0',
          order: 'order-2 md:order-2',
          scale: 1.05,
        };
      case 2:
        return {
          card: 'bg-gradient-to-b from-slate-400/15 to-slate-800/60 border-slate-400/30',
          avatar: 'ring-slate-300 shadow-slate-400/30',
          badge: 'bg-slate-500/20 text-slate-300',
          height: 'md:pt-8',
          order: 'order-1 md:order-1',
          scale: 1,
        };
      case 3:
        return {
          card: 'bg-gradient-to-b from-amber-700/20 to-slate-800/60 border-amber-600/30',
          avatar: 'ring-amber-600 shadow-amber-600/30',
          badge: 'bg-amber-600/20 text-amber-400',
          height: 'md:pt-12',
          order: 'order-3 md:order-3',
          scale: 1,
        };
      default:
        return { card: '', avatar: '', badge: '', height: '', order: '', scale: 1 };
    }
  };

  const UserAvatar = ({ user, size = 'w-14 h-14', ring = '' }: { user: RankingUser; size?: string; ring?: string }) => (
    <div className={`${size} rounded-full flex-shrink-0 overflow-hidden ring-2 ${ring || 'ring-blue-500/50'}`}>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Ranking Global
              </h1>
              <p className="text-sm sm:text-base text-slate-400">
                Os melhores jogadores do QuizMaster
              </p>
            </div>
          </div>

          {/* Posição do usuário atual */}
          {currentUserRank && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8 shadow-lg shadow-blue-500/30"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-blue-100 text-sm sm:text-base mb-1">Sua posição</p>
                  <p className="text-3xl sm:text-4xl font-bold">#{currentUserRank}</p>
                  <p className="text-blue-200 text-xs sm:text-sm mt-1">
                    Continue jogando para subir no ranking!
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 flex-shrink-0" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Pódio TOP 3 */}
          {top3.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top 3
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                {top3.map((user, index) => {
                  const rank = index + 1;
                  const style = getPodiumStyle(rank);
                  const isCurrentUser = isUserMe(user, rank);
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      className={`${style.order} ${style.height}`}
                    >
                      <div
                        className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border shadow-2xl text-center ${style.card} ${
                          isCurrentUser ? 'ring-2 ring-blue-500/60' : ''
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          {getRankIcon(rank, rank === 1 ? 'w-10 h-10' : 'w-8 h-8')}
                        </div>
                        <div className="flex justify-center mb-3">
                          <UserAvatar
                            user={user}
                            size={rank === 1 ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-14 h-14 sm:w-16 sm:h-16'}
                            ring={style.avatar}
                          />
                        </div>
                        <h3 className="font-bold text-white text-sm sm:text-base truncate px-1">
                          {user.name}
                          {isCurrentUser && (
                            <span className="block text-xs font-normal text-blue-400 mt-0.5">(você)</span>
                          )}
                        </h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                          Nível {user.level}
                        </span>
                        <div className="mt-3 flex items-center justify-center gap-1 text-blue-400 font-bold text-lg sm:text-xl">
                          <Zap className="w-4 h-4" />
                          {user.xp} XP
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {getQuizzesCount(user)} quizzes
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Demais posições */}
          {rest.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
                Classificação geral
              </h2>
              <div className="space-y-3">
                {rest.map((user, index) => {
                  const rank = index + 4;
                  const isCurrentUser = isUserMe(user, rank);
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ x: 4 }}
                      className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl ${
                        isCurrentUser ? 'ring-2 ring-blue-500/60 border-blue-500/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-5">
                        <div className="flex-shrink-0 w-8 flex justify-center">
                          {getRankIcon(rank)}
                        </div>
                        <UserAvatar user={user} size="w-11 h-11 sm:w-14 sm:h-14" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-white truncate">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs font-normal text-blue-400">(você)</span>
                            )}
                          </h3>
                          <p className="text-sm text-slate-400">Nível {user.level}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center justify-end gap-1 text-lg sm:text-2xl font-bold text-blue-400">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                            {user.xp}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-400 flex items-center justify-end gap-1">
                            <BookOpen className="w-3 h-3" />
                            {getQuizzesCount(user)} quizzes
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {ranking.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center"
            >
              <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-white font-medium">Nenhum jogador no ranking ainda</p>
              <p className="text-slate-400 text-sm mt-1">Complete quizzes para aparecer aqui!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Ranking;
