import React, { createContext, useReducer, useEffect } from 'react';
import quizData from '../data/questions.json';
import { calculateScore } from '../utils/scoreCalculator';

export const QuizContext = createContext(null);

const SESSION_STORAGE_KEY = 'quizapp_active_session';

const initialQuestions = quizData.questions || [];
const initialMeta = quizData.quizMeta || {
  title: 'Computer Science Fundamentals',
  description: 'Test your core Computer Science knowledge.',
  totalQuestions: initialQuestions.length,
  timePerQuestion: 30,
  passingPercentage: 60,
};

const defaultTime = initialMeta.timePerQuestion || 30;

const initialState = {
  questions: initialQuestions,
  quizMeta: initialMeta,
  currentQuestionIndex: 0,
  answers: {},
  timeRemaining: defaultTime,
  status: 'not-started', // 'not-started' | 'in-progress' | 'submitted'
  startedAt: null,
  finishedAt: null,
  results: null,
};

function getRestoredState() {
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.status === 'in-progress') {
        return {
          ...initialState,
          ...parsed,
          questions: initialQuestions,
          quizMeta: initialMeta,
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse active quiz session from sessionStorage', err);
  }
  return initialState;
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ': {
      const now = Date.now();
      return {
        ...state,
        status: 'in-progress',
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: state.quizMeta.timePerQuestion || defaultTime,
        startedAt: now,
        finishedAt: null,
        results: null,
      };
    }

    case 'SELECT_ANSWER': {
      const { questionId, optionId } = action.payload;
      return {
        ...state,
        answers: {
          ...state.answers,
          [questionId]: optionId,
        },
      };
    }

    case 'NEXT_QUESTION': {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          timeRemaining: state.quizMeta.timePerQuestion || defaultTime,
        };
      }
      return state;
    }

    case 'PREV_QUESTION': {
      if (state.currentQuestionIndex > 0) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
          timeRemaining: state.quizMeta.timePerQuestion || defaultTime,
        };
      }
      return state;
    }

    case 'JUMP_TO_QUESTION': {
      const targetIndex = action.payload;
      if (targetIndex >= 0 && targetIndex < state.questions.length) {
        return {
          ...state,
          currentQuestionIndex: targetIndex,
          timeRemaining: state.quizMeta.timePerQuestion || defaultTime,
        };
      }
      return state;
    }

    case 'TICK_TIMER': {
      if (state.status !== 'in-progress') return state;
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      };
    }

    case 'AUTO_ADVANCE': {
      if (state.status !== 'in-progress') return state;
      // If currently on last question, auto-submit quiz
      if (state.currentQuestionIndex >= state.questions.length - 1) {
        const finishedAt = Date.now();
        const results = calculateScore(
          state.questions,
          state.answers,
          state.quizMeta,
          state.startedAt,
          finishedAt
        );
        return {
          ...state,
          status: 'submitted',
          finishedAt,
          results,
        };
      }
      // Otherwise move to next question
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        timeRemaining: state.quizMeta.timePerQuestion || defaultTime,
      };
    }

    case 'SUBMIT_QUIZ': {
      const finishedAt = Date.now();
      const results = calculateScore(
        state.questions,
        state.answers,
        state.quizMeta,
        state.startedAt,
        finishedAt
      );
      return {
        ...state,
        status: 'submitted',
        finishedAt,
        results,
      };
    }

    case 'RESET_QUIZ': {
      return {
        ...initialState,
      };
    }

    case 'RESTORE_SESSION': {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState, getRestoredState);

  // Sync active quiz session to sessionStorage
  useEffect(() => {
    try {
      if (state.status === 'in-progress') {
        const sessionPayload = {
          currentQuestionIndex: state.currentQuestionIndex,
          answers: state.answers,
          timeRemaining: state.timeRemaining,
          status: state.status,
          startedAt: state.startedAt,
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Unable to write to sessionStorage:', err);
    }
  }, [state.status, state.currentQuestionIndex, state.answers, state.timeRemaining, state.startedAt]);

  // Warn user before leaving or reloading during an active quiz
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (state.status === 'in-progress') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.status]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}
