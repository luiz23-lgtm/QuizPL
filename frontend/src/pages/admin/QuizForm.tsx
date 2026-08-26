import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    subjectId: '',
    published: false,
  });
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsRes = await api.get('/admin/subjects');
        setSubjects(subjectsRes.data);

        if (isEdit) {
          const quizRes = await api.get(`/admin/quizzes/${id}`);
          const quiz = quizRes.data;
          setFormData({
            title: quiz.title, 
            description: quiz.description || '', 
            imageUrl: quiz.imageUrl || '',
            subjectId: quiz.subjectId.toString(), 
            published: quiz.published 
          });
          setImageError(false);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Falha ao carregar dados. Tente novamente.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/admin/quizzes/${id}`, {
          ...formData,
          subjectId: parseInt(formData.subjectId),
        });
      } else {
        await api.post('/admin/quizzes', {
          ...formData,
          subjectId: parseInt(formData.subjectId),
        });
      }
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Failed to save quiz:', error);
      setError('Falha ao salvar quiz. Verifique os dados e tente novamente.');
      setLoading(false);
    }
  };

  if (initialLoading) {
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/admin/quizzes"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8">
            {isEdit ? 'Editar quiz' : 'Criar novo quiz'}
          </h1>

          {error && (
            <div className="mb-6 bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Título
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                placeholder="Título do quiz"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition min-h-[100px] resize-none"
                placeholder="Descrição do quiz"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                URL da Imagem (opcional)
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setImageError(false);
                }}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {formData.imageUrl && !imageError && (
                <div className="mt-2 rounded-2xl overflow-hidden border border-slate-600">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
              {formData.imageUrl && imageError && (
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm">
                  ⚠️ Não foi possível carregar a imagem. Verifique a URL.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Matéria
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                required
              >
                <option value="">Selecione uma matéria</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-semibold text-slate-300">
                Publicar quiz (ficará visível para os usuários)
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizForm;
