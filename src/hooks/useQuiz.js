import { useContext, useCallback } from 'react';
import { QuizContext } from '../context/QuizContext';

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }

  const { state, dispatch } = context;

  const currentQuestion = state.questions[state.currentQuestionIndex] || null;
  const totalQuestions = state.questions.length;
  const answeredCount = Object.values(state.answers).filter(
    (ans) => ans !== null && ans !== undefined
  ).length;
  const unansweredCount = totalQuestions - answeredCount;
  const isFirstQuestion = state.currentQuestionIndex === 0;
  const isLastQuestion = state.currentQuestionIndex === totalQuestions - 1;

  const startQuiz = useCallback(() => {
    dispatch({ type: 'START_QUIZ' });
  }, [dispatch]);

  const selectAnswer = useCallback((questionId, optionId) => {
    dispatch({ type: 'SELECT_ANSWER', payload: { questionId, optionId } });
  }, [dispatch]);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, [dispatch]);

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' });
  }, [dispatch]);

  const jumpToQuestion = useCallback((index) => {
    dispatch({ type: 'JUMP_TO_QUESTION', payload: index });
  }, [dispatch]);

  const tickTimer = useCallback(() => {
    dispatch({ type: 'TICK_TIMER' });
  }, [dispatch]);

  const autoAdvance = useCallback(() => {
    dispatch({ type: 'AUTO_ADVANCE' });
  }, [dispatch]);

  const submitQuiz = useCallback(() => {
    dispatch({ type: 'SUBMIT_QUIZ' });
  }, [dispatch]);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, [dispatch]);

  return {
    ...state,
    currentQuestion,
    totalQuestions,
    answeredCount,
    unansweredCount,
    isFirstQuestion,
    isLastQuestion,
    dispatch,
    startQuiz,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    tickTimer,
    autoAdvance,
    submitQuiz,
    resetQuiz,
  };
}
