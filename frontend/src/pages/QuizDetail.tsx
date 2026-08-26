import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import type { Quiz } from '../types';
import { CheckCircle2, ChevronRight, Trophy, Loader2, ArrowLeft, XCircle, Home, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const getNormalizedOption = (opt?: string | number): string => {
  if (!opt) return 'A';
  const str = String(opt).trim().toUpperCase();
  if (str === '1' || str === 'OPTIONA' || str === 'OPTION_A') return 'A';
  if (str === '2' || str === 'OPTIONB' || str === 'OPTION_B') return 'B';
  if (str === '3' || str === 'OPTIONC' || str === 'OPTION_C') return 'C';
  if (str === '4' || str === 'OPTIOND' || str === 'OPTION_D') return 'D';
  if (['A', 'B', 'C', 'D'].includes(str)) return str;
  return 'A';
};

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => setDisplayValue(latest));
    const controls = animate(count, value, {
      type: 'tween',
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.35,
    });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [count, rounded, value]);

  return (
    <div className="flex items-center justify-center gap-1 text-blue-400">
      <Zap className="w-7 h-7 sm:w-8 sm:h-8" />
      <span className="text-3xl sm:text-4xl font-bold">{displayValue}</span>
    </div>
  );
};

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; selectedOption: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong'>('none');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    setFeedbackState('none');
    setSubmitError(null);
  }, [currentQuestion]);

  const handleAnswer = (questionId: number, selectedOption: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOption } : a
        );
      }
      return [...prev, { questionId, selectedOption }];
    });

    const q = quiz?.questions.find((qu) => qu.id === questionId);
    if (q) {
      const isCorrect = getNormalizedOption(q.correctOption) === selectedOption;
      setFeedbackState(isCorrect ? 'correct' : 'wrong');
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await api.post(`/quizzes/${id}/submit`, { answers });
      setResult(response.data);
      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (error: any) {
      console.error('Failed to submit quiz:', error);
      // Se o quiz já foi concluído ou retornou 400, navega silenciosamente de volta para a Home sem caixas vermelhas ou alertas
      if (
        error?.response?.status === 400 ||
        error?.response?.data?.error === 'Quiz already completed'
      ) {
        navigate('/', { replace: true });
        return;
      }
      const message = error?.response?.data?.error || 'Erro ao enviar quiz. Tente novamente.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const question = quiz?.questions[currentQuestion];
  const currentAnswer = question && answers.find((a) => a.questionId === question.id);
  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const showFeedback = feedbackState !== 'none';
  const correctOptionLetter = question ? getNormalizedOption(question.correctOption) : 'A';

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

  if (!quiz) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
          <p className="text-white font-medium">Quiz não encontrado</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl" />
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30 relative z-10"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 relative z-10">
              🎉 Quiz concluído!
            </h1>
            <p className="text-slate-400 mb-6 sm:mb-8 relative z-10">
              Mandou bem! Olha só o resultado:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-slate-700/50 rounded-2xl p-4 sm:p-6 border border-white/10"
              >
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-1">
                  {result.correctCount}
                  <span className="text-lg sm:text-xl text-slate-500 font-medium">
                    /{result.totalQuestions || quiz?.questions?.length || 0}
                  </span>
                </div>
                <div className="text-slate-400 text-sm">Corretas</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-slate-700/50 rounded-2xl p-4 sm:p-6 border border-white/10 relative overflow-hidden"
              >
                <AnimatedCounter value={result.xpEarned || 0} />
                <div className="text-slate-400 text-sm mt-1">XP ganhos</div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                  className="absolute -right-2 -top-2 text-2xl sm:text-3xl"
                >
                  ⚡
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl p-4 sm:p-6 border border-purple-500/20"
              >
                <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-1">
                  {result.user?.level || 1}
                </div>
                <div className="text-slate-400 text-sm">Nível atual</div>
              </motion.div>
            </div>

            {result.unlockedAchievements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 sm:mb-8 relative z-10"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                  🏆 Novas Conquistas desbloqueadas!
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {result.unlockedAchievements.map((achievement: any, i: number) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="bg-yellow-500/15 border border-yellow-500/30 rounded-2xl px-5 py-4 min-w-[140px]"
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <div className="font-semibold text-yellow-300 text-sm sm:text-base">
                        {achievement.name}
                      </div>
                      {achievement.description && (
                        <div className="text-xs text-yellow-200/70 mt-1">
                          {achievement.description}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/', { replace: true })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 relative z-10"
            >
              <Home className="w-5 h-5" />
              Voltar para o Início
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 sm:mb-6 transition text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-400">
                Questão {currentQuestion + 1} de {quiz.questions.length}
              </span>
              <span className="text-sm font-semibold text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {question?.imageUrl && !imageErrors[question.id] && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-700/50">
                  <img
                    src={question.imageUrl}
                    alt={question.text}
                    className="w-full h-48 sm:h-64 object-cover"
                    onError={() => setImageErrors((prev) => ({ ...prev, [question!.id]: true }))}
                  />
                </div>
              )}
              {question?.imageUrl && imageErrors[question.id] && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm">
                  ⚠️ Não foi possível carregar a imagem.
                </div>
              )}

              <h2 className="text-lg sm:text-2xl font-bold text-white mb-6 sm:mb-8 leading-snug">
                {question?.text}
              </h2>

              {feedbackState === 'correct' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 sm:p-5 bg-green-500/15 border-2 border-green-500/40 rounded-2xl flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-400 mb-1">🎉 Resposta correta!</p>
                    {question?.explanation && (
                      <p className="text-green-300/80 text-sm">{question.explanation}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {feedbackState === 'wrong' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 sm:p-5 bg-red-500/15 border-2 border-red-500/40 rounded-2xl flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/30 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-red-400 mb-1">❌ Resposta incorreta!</p>
                    <p className="text-red-300/80 text-sm">
                      A alternativa correta é a{' '}
                      <strong className="text-red-300">Alternativa {correctOptionLetter}</strong>
                      .{question?.explanation && (
                        <>
                          <br />
                          <span className="mt-1 inline-block">{question.explanation}</span>
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option${option}` as keyof typeof question;
                  const optionText = question?.[optionKey] as string | undefined;
                  const isSelected = currentAnswer?.selectedOption === option;
                  const isCorrect = correctOptionLetter === option;

                  let buttonClass =
                    'w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ';

                  if (showFeedback && isSelected) {
                    buttonClass += isCorrect
                      ? 'border-green-500 bg-green-500/20 ring-4 ring-green-500/10'
                      : 'border-red-500 bg-red-500/20 ring-4 ring-red-500/10';
                  } else if (showFeedback && isCorrect) {
                    buttonClass += 'border-green-500/60 bg-green-500/10';
                  } else if (isSelected) {
                    buttonClass += 'border-blue-500 bg-blue-500/20 ring-4 ring-blue-500/10';
                  } else {
                    buttonClass +=
                      'border-slate-700/60 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-700/30';
                  }

                  if (currentAnswer) {
                    buttonClass +=
                      showFeedback && !isSelected && !isCorrect
                        ? ' opacity-60 cursor-not-allowed'
                        : ' cursor-not-allowed';
                  }

                  return (
                    <motion.button
                      key={option}
                      whileTap={!currentAnswer ? { scale: 0.98 } : undefined}
                      onClick={() => question && !currentAnswer && handleAnswer(question.id, option)}
                      disabled={!!currentAnswer}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div
                            translate="no"
                            className={`notranslate w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 transition-colors ${
                              showFeedback && isSelected
                                ? isCorrect
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                  : 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                : showFeedback && isCorrect
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                  : isSelected
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-700/70 text-slate-300'
                            }`}
                          >
                            {option}
                          </div>
                          <span className="text-sm sm:text-lg font-medium text-white break-words">
                            {optionText || '—'}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          {showFeedback && isSelected && isCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                          {showFeedback && !isSelected && isCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 text-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{submitError}</span>
            </motion.div>
          )}

          <div className="mt-6 sm:mt-8 flex justify-stretch sm:justify-end">
            {currentQuestion < quiz.questions.length - 1 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={!currentAnswer}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Próxima
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!currentAnswer || submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Enviar'
                )}
              </motion.button>
            )}
          </div>
        </div>
    </div>
  );
};

export default QuizDetail;
