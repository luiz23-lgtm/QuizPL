import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../lib/apiError';
import api from '../lib/axios';
import {
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAdminContext = pathname.startsWith('/admin');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'USER' | 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!isAdminContext && !authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate, isAdminContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdminContext) {
        await api.post('/admin/users', {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/users', { replace: true });
        }, 1200);
      } else {
        await register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );
        setSuccess(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Falha no cadastro. Tente novamente.'));
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition-all duration-200 text-base';

  return (
    <div
      className={`${
        isAdminContext
          ? 'p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto'
          : 'min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 overflow-hidden relative'
      }`}
    >
      {!isAdminContext && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-40 w-72 sm:w-80 h-72 sm:h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-72 sm:w-80 h-72 sm:h-80 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full relative z-10 ${isAdminContext ? '' : 'max-w-md'}`}
      >
        {isAdminContext && (
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para usuários
          </Link>
        )}

        <div
          className={`${
            isAdminContext
              ? 'bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 lg:p-10'
              : 'bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 lg:p-10'
          }`}
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={`inline-flex items-center justify-center ${
                isAdminContext ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-20 sm:h-20'
              } bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-blue-500/30`}
            >
              {isAdminContext ? (
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              ) : (
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              )}
            </motion.div>
            <p className="text-blue-400 text-sm font-semibold mb-1">
              {isAdminContext ? 'Painel Admin' : 'QuizMaster'}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {isAdminContext ? 'Novo Usuário' : 'Criar conta'}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              {isAdminContext
                ? 'Preencha os dados para cadastrar um novo aluno ou administrador.'
                : 'Comece sua jornada de aprendizado hoje'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label
                htmlFor={isAdminContext ? 'admin-name' : 'register-name'}
                className="block text-sm font-semibold text-slate-300"
              >
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id={isAdminContext ? 'admin-name' : 'register-name'}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  spellCheck={false}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  placeholder="Nome do aluno"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <label
                htmlFor={isAdminContext ? 'admin-email' : 'register-email'}
                className="block text-sm font-semibold text-slate-300"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id={isAdminContext ? 'admin-email' : 'register-email'}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="aluno@email.com"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label
                htmlFor={isAdminContext ? 'admin-password' : 'register-password'}
                className="block text-sm font-semibold text-slate-300"
              >
                Senha temporária
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id={isAdminContext ? 'admin-password' : 'register-password'}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={isAdminContext ? 'off' : 'new-password'}
                  minLength={6}
                  spellCheck={false}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`${inputClass} pr-12`}
                  placeholder="Mínimo 6 caracteres"
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {isAdminContext && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-slate-300">Permissão</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'USER', label: 'Aluno', desc: 'Faz quizzes, vê ranking', icon: '👤' },
                    {
                      value: 'ADMIN',
                      label: 'Administrador',
                      desc: 'Cria quizzes e usuários',
                      icon: '🛡️',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: opt.value as 'USER' | 'ADMIN' })}
                      className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                        formData.role === opt.value
                          ? 'border-blue-500 bg-blue-500/15 ring-4 ring-blue-500/10'
                          : 'border-slate-700/60 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span>{opt.icon}</span>
                          {opt.label}
                        </span>
                        {formData.role === opt.value && (
                          <CheckCircle2 className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/15 border border-green-500/30 text-green-300 px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
                <span>
                  {isAdminContext
                    ? 'Usuário criado! Voltando para a lista...'
                    : 'Conta criada com sucesso! Redirecionando...'}
                </span>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isAdminContext ? 'Criando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  {isAdminContext ? (
                    <>
                      Criar Usuário
                      <ShieldCheck className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Criar conta
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </>
              )}
            </motion.button>
          </form>

          {!isAdminContext && (
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
              <p className="text-center text-slate-400 text-sm sm:text-base">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                >
                  Entrar
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
