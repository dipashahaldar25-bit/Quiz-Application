import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import Button from '../common/Button';

export default function SubmitConfirmModal({
  isOpen = false,
  unansweredCount = 0,
  totalQuestions = 10,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-950/20 transform transition-all animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              hasUnanswered
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {hasUnanswered ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3
              id="modal-title"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
            >
              {hasUnanswered ? 'Unanswered Questions' : 'Ready to Submit?'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Confirm quiz submission
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {hasUnanswered ? (
            <p>
              You still have{' '}
              <strong className="text-amber-600 dark:text-amber-400 font-bold">
                {unansweredCount} unanswered
              </strong>{' '}
              question{unansweredCount > 1 ? 's' : ''} out of {totalQuestions}.
              Unanswered questions will be marked as skipped. Are you sure you want to finish?
            </p>
          ) : (
            <p>
              Awesome job! You have answered all {totalQuestions} questions. Once you
              submit, your score will be calculated and displayed immediately.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            Review Answers
          </Button>
          <Button
            variant={hasUnanswered ? 'primary' : 'success'}
            onClick={onConfirm}
            className="w-full sm:w-auto font-semibold"
          >
            Yes, Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
