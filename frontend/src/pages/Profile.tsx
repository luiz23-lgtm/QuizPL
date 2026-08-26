import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import {
  Camera,
  Edit3,
  Save,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  Zap,
  LogOut,
  User,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Loader2,
  Check,
  ImageOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { XpHistory } from '../types';

const BANNER_PRESETS = [
  'linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)',
  'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)',
  'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)',
  'linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)',
  'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%)',
  'linear-gradient(135deg,#f43f5e 0%,#fb7185 50%,#f97316 100%)',
];

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [formName, setFormName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [banner, setBanner] = useState<string>(BANNER_PRESETS[0]);
  const [showBannerPicker, setShowBannerPicker] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedBanner = localStorage.getItem(`profile-banner-${user?.id}`);
    if (savedBanner) setBanner(savedBanner);
  }, [user?.id]);

  useEffect(() => {
    setFormName(user?.name || '');
    setAvatarUrl(user?.avatar || '');
    setAvatarError(false);
  }, [user?.name, user?.avatar, user?.id]);

  const persistBanner = (css: string) => {
    setBanner(css);
    if (user?.id) localStorage.setItem(`profile-banner-${user.id}`, css);
  };

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleMediaPick = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('Imagem muito grande! Use até 3MB.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      if (type === 'avatar') {
        setAvatarUrl(dataUrl);
        setAvatarError(false);
      } else {
        persistBanner(`url("${dataUrl}") center/cover no-repeat`);
      }
    } catch {
      alert('Não foi possível carregar a imagem.');
    }
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!user) return;
    const trimmedName = formName.trim();
    if (trimmedName.length < 2) {
      alert('Nome precisa ter pelo menos 2 caracteres.');
      return;
    }
    setSaving(true);
    setSaved(false);
    try {
      const response = await api.put('/users/me', {
        name: trimmedName,
        avatar: avatarUrl || null,
      });
      updateUser(response.data);
      setFormName(response.data.name || trimmedName);
      setAvatarUrl(response.data.avatar || '');
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error: any) {
      console.error('Falha ao atualizar perfil:', error);
      const msg = error?.response?.data?.error || 'Falha ao salvar. Tente novamente.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormName(user?.name || '');
    setAvatarUrl(user?.avatar || '');
    setAvatarError(false);
  };

  const calculateXpProgress = (xp: number) => {
    const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                Meu perfil
              </h1>
              <p className="text-sm text-slate-400">Personalize seu espaço</p>
            </div>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/15 border border-green-500/30 text-green-400 rounded-2xl text-sm font-semibold"
              >
                <Check className="w-4 h-4" /> Salvo!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden mb-6 sm:mb-8">
          <div
            className="relative h-28 sm:h-36 overflow-hidden group"
            style={{ background: banner }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40" />
            <button
              type="button"
              onClick={() => setShowBannerPicker((v) => !v)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 backdrop-blur-md border border-white/10 transition"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Personalizar banner</span>
              <span className="sm:hidden">Banner</span>
            </button>
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleMediaPick(e, 'banner')}
            />
          </div>

          <AnimatePresence>
            {showBannerPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-900/50 border-b border-white/10"
              >
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Escolha um estilo
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowBannerPicker(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                    {BANNER_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => persistBanner(preset)}
                        className={`aspect-[5/2] rounded-xl border-2 transition-all overflow-hidden ${
                          banner === preset
                            ? 'border-blue-500 ring-4 ring-blue-500/20 scale-[1.02]'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        style={{ background: preset }}
                        title={`Estilo ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => bannerFileRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/60 hover:bg-slate-700 text-white rounded-2xl border border-white/10 text-sm font-medium transition"
                    >
                      <Upload className="w-4 h-4" />
                      Enviar minha imagem
                    </button>
                    <p className="text-xs text-slate-400">
                      PNG, JPG ou WEBP • até 3MB
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-14 sm:-mt-20 mb-6 relative z-10">
              <div className="relative flex-shrink-0 mx-auto sm:mx-0 group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-slate-800 overflow-hidden ring-2 ring-blue-500/40 shadow-2xl bg-slate-700">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : avatarError ? (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400">
                      <ImageOff className="w-10 h-10" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleMediaPick(e, 'avatar')}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  hidden
                  onChange={(e) => handleMediaPick(e, 'avatar')}
                />

                <div className="absolute bottom-1 right-1 flex flex-col gap-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-full border border-white/10 shadow-lg flex items-center justify-center hover:bg-blue-600 hover:border-blue-500/50 transition"
                    title="Tirar foto com a câmera"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-800 rounded-full border border-white/10 shadow-lg flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500/50 transition"
                    title="Escolher da galeria"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                      {user.name}
                    </h2>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditing((prev) => !prev);
                        setFormName(user.name);
                        setAvatarUrl(user.avatar || '');
                      }}
                      className="px-3.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition mx-auto sm:mx-0 inline-flex items-center gap-1.5 border border-blue-500/30 text-xs sm:text-sm font-semibold shadow-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{editing ? 'Fechar edição' : 'Editar nome'}</span>
                    </motion.button>
                  </div>
                  <p className="text-slate-400 break-all">{user.email}</p>
                  <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start mt-3 sm:mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 border border-blue-500/20 text-blue-300 text-xs sm:text-sm font-medium rounded-full">
                      {user.role === 'ADMIN' ? '🛡️ Administrador' : '🎓 Aluno'}
                    </span>
                    {saved && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-medium rounded-full"
                      >
                        <Check className="w-3.5 h-3.5" /> Salvo!
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-2xl p-4 sm:p-6 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-400">Nível atual</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">Nível {user.level}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-slate-400">XP total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400 flex items-center sm:justify-end gap-1">
                    <Zap className="w-6 h-6" />
                    {user.xp}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progresso para o nível {user.level + 1}</span>
                  <span className="font-medium text-white">
                    {Math.round(calculateXpProgress(user.xp))}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateXpProgress(user.xp)}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 15, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mb-6 sm:mb-8 overflow-hidden"
            >
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-2xl p-5 sm:p-8 relative">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Editar Perfil</h2>
                      <p className="text-xs sm:text-sm text-slate-400">Altere seu nome de exibição e foto</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-400" />
                      Seu nome
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition text-base"
                      placeholder="Como quer ser chamado(a)?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                      URL da foto de perfil (opcional)
                    </label>
                    <input
                      type="url"
                      value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        setAvatarError(false);
                      }}
                      className="w-full px-4 py-3.5 bg-slate-900/60 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition text-base"
                      placeholder="https://exemplo.com/sua-foto.jpg"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Salvar alterações
                        </>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-5 py-3.5 text-slate-400 hover:text-white bg-slate-700/30 hover:bg-slate-700/60 rounded-2xl transition border border-white/5 text-sm font-medium"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl('');
                        setAvatarError(false);
                      }}
                      className="px-4 py-3.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition text-xs sm:text-sm font-medium ml-auto"
                      title="Remover avatar customizado"
                    >
                      Usar foto padrão
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {[
            {
              icon: CheckCircle2,
              color: 'blue',
              label: 'Quizzes feitos',
              value: user.quizzesCompleted?.length || 0,
            },
            {
              icon: Award,
              color: 'amber',
              label: 'Conquistas',
              value: user.userAchievements?.length || 0,
            },
            {
              icon: Flame,
              color: 'orange',
              label: 'Sequência',
              value: `${user.streak || 0} dias`,
            },
            {
              icon: Calendar,
              color: 'emerald',
              label: 'Membro desde',
              value: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                month: 'short',
                year: 'numeric',
              }),
            },
          ].map((stat, index) => {
            const colors: Record<string, string> = {
              blue: 'bg-blue-500/20 text-blue-400',
              amber: 'bg-amber-500/20 text-amber-400',
              orange: 'bg-orange-500/20 text-orange-400',
              emerald: 'bg-emerald-500/20 text-emerald-400',
            };
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 ${colors[stat.color]}`}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-white break-words">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {user.xpHistory && user.xpHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Histórico de XP
            </h2>
            <div className="space-y-3">
              {user.xpHistory.slice(0, 10).map((history: XpHistory, index: number) => (
                <motion.div
                  key={history.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm sm:text-base truncate">
                        {history.reason}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(history.earnedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-emerald-400 font-bold flex-shrink-0">
                    +{history.amount} XP
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-red-500/15 border border-red-500/30 text-red-400 font-semibold rounded-2xl hover:bg-red-500/25 transition"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
