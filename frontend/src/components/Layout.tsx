import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Trophy, Award, User, LogOut, BookOpen, Shield, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Trophy, label: 'Ranking', path: '/ranking' },
    { icon: Award, label: 'Conquistas', path: '/achievements' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  const calculateXpProgress = (xp: number) => {
    const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const NavContent = () => (
    <>
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">QuizMaster</span>
        </div>
      </div>

      {user && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/40 flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{user.name}</p>
              <p className="text-sm text-slate-400">Nível {user.level}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Progresso XP</span>
              <span className="font-medium text-blue-400">{user.xp} XP</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${calculateXpProgress(user.xp)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all mt-2',
                isActive
                  ? 'bg-purple-500/30 text-purple-300 font-medium border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              )
            }
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            <span>Painel Admin</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col lg:flex-row">
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <span className="font-bold text-white">QuizMaster</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800/60 border border-white/10 text-white"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col z-50"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex-col flex-shrink-0">
        <NavContent />
      </aside>

      <main className="flex-1 overflow-auto min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
