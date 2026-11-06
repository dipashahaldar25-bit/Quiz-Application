import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckSquare, RotateCcw } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';
import { useTimer } from '../hooks/useTimer';
import Navbar from '../components/common/Navbar';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import Timer from '../components/quiz/Timer';
import QuestionCard from '../components/quiz/QuestionCard';
import QuestionNavigator from '../components/quiz/QuestionNavigator';
import SubmitConfirmModal from '../components/quiz/SubmitConfirmModal';

export default function Quiz() {
  const navigate = useNavigate();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const {
    status,
    questions,
    quizMeta,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    answers,
    timeRemaining,
    unansweredCount,
    isFirstQuestion,
    isLastQuestion,
    startQuiz,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    tickTimer,
    autoAdvance,
    submitQuiz,
    resetQuiz,
  } = useQuiz();

  // If status is not-started, automatically start quiz session
  useEffect(() => {
    if (status === 'not-started') {
      startQuiz();
    }
  }, [status, startQuiz]);

  // When submitted, navigate to /result
  useEffect(() => {
    if (status === 'submitted') {
      navigate('/result', { replace: true });
    }
  }, [status, navigate]);

  // Hook up per-question timer
  useTimer({
    timeRemaining,
    isActive: status === 'in-progress' && !isSubmitModalOpen,
    onTick: tickTimer,
    onExpire: autoAdvance,
  });

  // Handle final submission confirmation
  const handleConfirmSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);
    submitQuiz();
  }, [submitQuiz]);

  // Option selection handler
  const handleOptionSelect = (optionId) => {
    if (!currentQuestion) return;
    selectAnswer(currentQuestion.id, optionId);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentSelectedOption = answers[currentQuestion.id] ?? null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top Header: Progress + Timer */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex-1 max-w-lg">
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <Timer
              timeRemaining={timeRemaining}
              totalDuration={quizMeta.timePerQuestion || 30}
            />
          </div>
        </div>

        {/* Main Quiz Grid: Question Card (left) & Sidebar Navigator (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Area (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedOptionId={currentSelectedOption}
              onSelectOption={handleOptionSelect}
            />

            {/* Navigation Buttons Row */}
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <Button
                variant="outline"
                disabled={isFirstQuestion}
                onClick={prevQuestion}
                icon={ChevronLeft}
                iconPosition="left"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!isLastQuestion ? (
                  <Button
                    variant="primary"
                    onClick={nextQuestion}
                    icon={ChevronRight}
                    iconPosition="right"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => setIsSubmitModalOpen(true)}
                    icon={CheckSquare}
                    iconPosition="left"
                    className="font-bold shadow-md shadow-emerald-500/20"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Navigator Area (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <QuestionNavigator
              totalQuestions={totalQuestions}
              currentIndex={currentQuestionIndex}
              answers={answers}
              questions={questions}
              onJump={jumpToQuestion}
            />

            {/* Quick Helper info card */}
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Keyboard Shortcuts:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Keys <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">1</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">4</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">A</kbd> - <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">D</kbd> to select option</li>
                <li>Click any question number above to jump</li>
                <li>Progress is automatically saved on refresh</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        unansweredCount={unansweredCount}
        totalQuestions={totalQuestions}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
