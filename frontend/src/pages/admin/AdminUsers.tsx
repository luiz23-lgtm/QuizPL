import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { Users, Trophy, Edit, Ban, Zap, Mail, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  _count?: { quizzesCompleted: number };
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Falha ao carregar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: AdminUser) => {
    alert(`Editar usuário: ${user.name}\n(Funcionalidade simulada)`);
  };

  const handleBlock = (user: AdminUser) => {
    alert(`Bloquear usuário: ${user.name}\n(Funcionalidade simulada)`);
  };

  const UserAvatar = ({ user }: { user: AdminUser }) => (
    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-blue-500/30">
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Usuários</h1>
              <p className="text-sm text-slate-400">{users.length} cadastrados</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/admin/users/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all text-sm sm:text-base"
            >
              <UserPlus className="w-5 h-5" />
              Novo Usuário
            </Link>
          </motion.div>
        </div>

        {/* Mobile: cards */}
        <div className="lg:hidden space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-3">
                <UserAvatar user={user} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    {user.email}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-slate-600/50 text-slate-300'
                  }`}
                >
                  {user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm mb-3">
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {user.xp} XP
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  Nível {user.level}
                </span>
                <span className="text-slate-400">
                  {user._count?.quizzesCompleted || 0} quizzes
                </span>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(user)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-blue-500/20 text-blue-400 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBlock(user)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-500/20 text-red-400 text-sm font-medium"
                >
                  <Ban className="w-4 h-4" />
                  Bloquear
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: tabela */}
        <div className="hidden lg:block bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-white/10">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Usuário</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">E-mail</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Nível</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">XP</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Quizzes</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Papel</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">Cadastro</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                        <Trophy className="w-4 h-4" />
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-400">{user.xp}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {user._count?.quizzesCompleted || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-slate-600/50 text-slate-300'
                        }`}
                      >
                        {user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-xl transition"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBlock(user)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition"
                          title="Bloquear"
                        >
                          <Ban className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
