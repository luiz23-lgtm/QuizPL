import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Trophy,
  Award,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: BookOpen, label: 'Matérias', path: '/admin/subjects' },
    { icon: FileText, label: 'Quizzes', path: '/admin/quizzes' },
    { icon: Trophy, label: 'Ranking', path: '/admin/ranking' },
    { icon: Award, label: 'Conquistas', path: '/admin/achievements' },
  ];

  const NavContent = () => (
    <>
      <div className="p-4 sm:p-6 border-b border-white/10">
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            navigate('/');
          }}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao app</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Painel Admin</h1>
            <p className="text-xs text-slate-400">QuizMaster</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all',
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
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
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          <span className="font-bold text-white">Admin</span>
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

      {/* Mobile sidebar overlay */}
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

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex-col flex-shrink-0">
        <NavContent />
      </aside>

      <main className="flex-1 overflow-auto min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
