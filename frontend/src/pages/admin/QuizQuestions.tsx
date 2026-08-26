import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { ArrowLeft, Plus, Save, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id?: number;
  text: string;
  imageUrl?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  xpReward: number;
}

const QuizQuestions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizRes = await api.get(`/admin/quizzes/${id}`);
        setQuiz(quizRes.data);
        
        // Check localStorage for unsaved changes
        const savedQuestions = localStorage.getItem(`quiz-questions-${id}`);
        if (savedQuestions) {
          const parsed = JSON.parse(savedQuestions);
          setQuestions(parsed);
        } else {
          setQuestions(
            quizRes.data.questions?.map((q: any) => ({
              id: q.id,
              text: q.text,
              imageUrl: q.imageUrl || '',
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctOption: q.correctOption,
              explanation: q.explanation || '',
              xpReward: q.xpReward,
            })) || []
          );
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        setLoadError('Falha ao carregar quiz. Verifique sua conexão e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        imageUrl: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
        explanation: '',
        xpReward: 10,
      }
    ]);
    // Scroll to the new question
    setTimeout(() => {
      const questionElements = document.querySelectorAll('[data-question-index]');
      const lastElement = questionElements[questionElements.length - 1];
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    localStorage.setItem(`quiz-questions-${id}`, JSON.stringify(newQuestions));
    // Clear image error for removed question
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
    localStorage.setItem(`quiz-questions-${id}`, JSON.stringify(newQuestions));
    
    // Clear image error when URL changes
    if (field === 'imageUrl' && value) {
      setImageErrors(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // First, delete existing questions
      const existingQuestions = quiz.questions || [];
      for (const q of existingQuestions) {
        await api.delete(`/admin/questions/${q.id}`);
      }

      // Create new questions
      for (const q of questions) {
        await api.post('/admin/questions', { ...q, quizId: parseInt(id as string) });
      }

      // Clear localStorage after successful save
      localStorage.removeItem(`quiz-questions-${id}`);
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Failed to save questions:', error);
      setError('Falha ao salvar questões. Tente novamente.');
    } finally {
      setSaving(false);
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

  if (loadError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar</h2>
          <p className="text-slate-400 mb-6">{loadError}</p>
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/admin/quizzes"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 break-words">
          Questões — {quiz.title}
        </h1>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Add Question Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addQuestion}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Questão
          </motion.button>

          {/* Questions List */}
          <AnimatePresence mode="popLayout">
            {questions.map((question, index) => (
            <motion.div
              key={question.id || index}
              data-question-index={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  Questão {index + 1}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeQuestion(index)}
                  className="p-2 sm:p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    Pergunta
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                    placeholder="Digite a pergunta"
                  />
                  <div className="space-y-2 mt-4">
                    <label className="block text-sm font-semibold text-slate-300">
                      URL da Imagem (opcional)
                    </label>
                    <input
                      type="url"
                      value={question.imageUrl}
                      onChange={(e) => updateQuestion(index, 'imageUrl', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    {question.imageUrl && !imageErrors[index] && (
                      <div className="mt-2 rounded-2xl overflow-hidden border border-slate-600">
                        <img 
                          src={question.imageUrl} 
                          alt="Preview" 
                          className="w-full h-32 object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                      </div>
                    )}
                    {question.imageUrl && imageErrors[index] && (
                      <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm">
                        ⚠️ Não foi possível carregar a imagem. Verifique a URL.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <div key={opt} className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300">
                        Opção {opt}
                      </label>
                      <input
                        type="text"
                        value={question[`option${opt}` as keyof Question]}
                        onChange={(e) =>
                          updateQuestion(index, `option${opt}` as keyof Question, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                        placeholder={`Alternativa ${opt}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      Resposta correta
                    </label>
                    <select
                      value={question.correctOption}
                      onChange={(e) => updateQuestion(index, 'correctOption', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                    >
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      XP Recompensa
                    </label>
                    <input
                      type="number"
                      value={question.xpReward}
                      onChange={(e) => updateQuestion(index, 'xpReward', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    Explicação (opcional)
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-slate-700/70 outline-none transition min-h-[80px] resize-none"
                    placeholder="Explicação da resposta"
                  />
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>

          {/* Save Button */}
          {questions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Questões
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizQuestions;
