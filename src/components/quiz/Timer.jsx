import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Timer({ timeRemaining = 30, totalDuration = 30 }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeRemaining / totalDuration));
  const strokeDashoffset = circumference - progress * circumference;

  const isUrgent = timeRemaining <= 5;
  const isWarning = timeRemaining <= 10 && !isUrgent;

  let colorClass = 'text-brand-600 dark:text-brand-400 stroke-brand-600 dark:stroke-brand-400';
  let bgFillClass = 'bg-brand-50/50 dark:bg-brand-950/40 border-brand-200/80 dark:border-brand-800/80';

  if (isUrgent) {
    colorClass = 'text-rose-600 dark:text-rose-400 stroke-rose-600 dark:stroke-rose-400 animate-pulse';
    bgFillClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800';
  } else if (isWarning) {
    colorClass = 'text-amber-500 dark:text-amber-400 stroke-amber-500 dark:stroke-amber-400';
    bgFillClass = 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800';
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border transition-all duration-300 ${bgFillClass}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52">
          {/* Background track circle */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className={`transition-all duration-1000 ease-linear ${colorClass}`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <span className={`absolute text-xs font-black tracking-tighter ${colorClass}`}>
          {timeRemaining}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          Time Left
        </span>
        <span className={`text-xs font-bold leading-none ${colorClass} flex items-center gap-1`}>
          {isUrgent ? (
            <>
              <AlertTriangle className="w-3 h-3 animate-bounce" />
              <span>Hurry!</span>
            </>
          ) : (
            <span>{timeRemaining}s</span>
          )}
        </span>
      </div>
    </div>
  );
}
