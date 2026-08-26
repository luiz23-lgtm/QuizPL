import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../lib/apiError';
import {
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email.trim(), formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Falha no login. Tente novamente.'));
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition-all duration-200 text-base';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-72 sm:w-80 h-72 sm:h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-72 sm:w-80 h-72 sm:h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-blue-500/30"
            >
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <p className="text-blue-400 text-sm font-semibold mb-1">QuizMaster</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Entre para continuar sua jornada de aprendizado
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
            data-form-type="login"
            autoComplete="on"
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <label htmlFor="login-email" className="block text-sm font-semibold text-slate-300">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="seu@email.com"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  spellCheck={false}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`${inputClass} pr-12`}
                  placeholder="••••••••"
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
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Login realizado com sucesso! Redirecionando...</span>
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
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <p className="text-xs sm:text-sm text-blue-300/90 leading-relaxed">
              <span className="font-semibold">ℹ️ Dica:</span> Se o Chrome mostrar um aviso de
              &quot;senha vazada&quot; ao entrar, isso é um recurso de segurança padrão do
              navegador em <em>sites de desenvolvimento local</em>. Clique em{' '}
              <strong>Ignorar</strong> ou feche o aviso — sua senha está 100% segura aqui!
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10">
            <p className="text-center text-slate-500 text-xs sm:text-sm">
              💡 Contas são criadas apenas pelo professor/administrador.
              <br className="sm:hidden" />
              <span className="hidden sm:inline">&nbsp;</span>
              Se você não tem acesso, peça a quem coordena!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
