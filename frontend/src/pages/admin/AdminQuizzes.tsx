import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, subjectsRes] = await Promise.all([
          api.get('/admin/quizzes'),
          api.get('/admin/subjects'),
        ]);
        setQuizzes(quizzesRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Falha ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSubject = !selectedSubject || quiz.subjectId === parseInt(selectedSubject);
    const matchesSearch = !search || quiz.title.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return;
    try {
      await api.delete(`/admin/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const togglePublished = async (id: number, current: boolean) => {
    try {
      const quiz = quizzes.find((q) => q.id === id);
      if (!quiz) return;
      await api.put(`/admin/quizzes/${id}`, { ...quiz, published: !current });
      setQuizzes(quizzes.map((q) => q.id === id ? { ...q, published: !current } : q));
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
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

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition"
          >
            Tentar novamente
          </button>
        </div>
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
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Quizzes</h1>
              <p className="text-sm text-slate-400">{filteredQuizzes.length} exibidos</p>
            </div>
          </div>
          <Link
            to="/admin/quizzes/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Criar quiz
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
          <select
            value={selectedSubject || ''}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
            className="w-full sm:w-auto px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
          >
            <option value="">Todas as Matérias</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 sm:max-w-xs px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full mb-2">
                      {quiz.subject?.name}
                    </span>
                    <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
                  </div>
                  <button
                    onClick={() => togglePublished(quiz.id, quiz.published)}
                    className={`p-2 rounded-xl transition ${
                      quiz.published
                        ? 'text-green-400 hover:bg-green-500/20'
                        : 'text-slate-500 hover:bg-slate-700/50'
                    }`}
                    title={quiz.published ? 'Despublicar' : 'Publicar'}
                  >
                    {quiz.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                {quiz.description && (
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {quiz.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{quiz.questions?.length || 0} questões</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    quiz.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {quiz.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4 border-t border-white/10">
                  <Link
                    to={`/admin/quizzes/${quiz.id}/edit`}
                    className="flex-1 px-4 py-2.5 text-blue-400 font-semibold rounded-2xl hover:bg-blue-500/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </Link>
                  <Link
                    to={`/admin/quizzes/${quiz.id}/questions`}
                    className="flex-1 px-4 py-2.5 text-purple-400 font-semibold rounded-2xl hover:bg-purple-500/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    Questões
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(quiz.id)}
                    className="px-4 py-2.5 text-red-400 font-semibold rounded-2xl hover:bg-red-500/20 transition flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminQuizzes;
