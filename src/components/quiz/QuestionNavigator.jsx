import React from 'react';
import Card from '../common/Card';

export default function QuestionNavigator({
  totalQuestions = 10,
  currentIndex = 0,
  answers = {},
  questions = [],
  onJump,
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Question Navigator
        </h3>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {Object.values(answers).filter((a) => a !== null && a !== undefined).length} / {totalQuestions} answered
        </span>
      </div>

      {/* Grid of numbers */}
      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-5 gap-2 mb-4">
        {questions.map((q, index) => {
          const isCurrent = index === currentIndex;
          const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;

          let btnStyles = 'bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750';

          if (isAnswered && !isCurrent) {
            btnStyles = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-semibold';
          } else if (isCurrent) {
            btnStyles = 'bg-brand-600 text-white shadow-md shadow-brand-500/30 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900 font-bold';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJump(index)}
              aria-label={`Go to Question ${index + 1}${isAnswered ? ' (Answered)' : ''}${isCurrent ? ' (Current)' : ''}`}
              className={`h-9 rounded-xl text-xs sm:text-sm flex items-center justify-center transition-all duration-150 focus:outline-none ${btnStyles}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>Skipped</span>
        </div>
      </div>
    </Card>
  );
}
