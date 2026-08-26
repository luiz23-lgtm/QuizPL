import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Plus, Edit2, Trash2, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Subject {
  id: number;
  name: string;
  _count?: { quizzes: number };
}

const inputClass =
  'w-full px-4 py-3.5 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition';

const AdminSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const fetchSubjects = async () => {
    const response = await api.get('/admin/subjects');
    setSubjects(response.data);
  };

  useEffect(() => {
    fetchSubjects()
      .catch((e) => console.error('Falha ao carregar matérias:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await api.put(`/admin/subjects/${editingSubject.id}`, formData);
      } else {
        await api.post('/admin/subjects', formData);
      }
      await fetchSubjects();
      setShowModal(false);
      setEditingSubject(null);
      setFormData({ name: '' });
    } catch (error) {
      console.error('Falha ao salvar matéria:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta matéria?')) return;
    try {
      await api.delete(`/admin/subjects/${id}`);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Falha ao excluir matéria:', error);
    }
  };

  const openCreate = () => {
    setEditingSubject(null);
    setFormData({ name: '' });
    setShowModal(true);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Matérias</h1>
              <p className="text-sm text-slate-400">Organize os quizzes por área</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            Nova matéria
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white truncate">{subject.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingSubject(subject);
                        setFormData({ name: subject.name });
                        setShowModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(subject.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">
                  <span className="text-blue-400 font-semibold">
                    {subject._count?.quizzes || 0}
                  </span>{' '}
                  {subject._count?.quizzes === 1 ? 'quiz' : 'quizzes'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma matéria cadastrada</p>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 sm:p-8 border border-white/10 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingSubject ? 'Editar matéria' : 'Nova matéria'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Nome da matéria
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ name: e.target.value })}
                      className={inputClass}
                      placeholder="Ex: Matemática"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3.5 text-slate-300 font-semibold rounded-2xl border border-slate-600 hover:bg-slate-700/50 transition w-full"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 w-full"
                    >
                      Salvar
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminSubjects;
