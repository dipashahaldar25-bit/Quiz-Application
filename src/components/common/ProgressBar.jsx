import React from 'react';

export default function ProgressBar({
  current = 1,
  total = 10,
  showLabel = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <span>
            Question <span className="text-slate-900 dark:text-white font-bold">{current}</span> of {total}
          </span>
          <span className="text-brand-600 dark:text-brand-400 font-bold">{percentage}% Completed</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
