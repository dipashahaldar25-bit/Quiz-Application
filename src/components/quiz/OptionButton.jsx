import React from 'react';
import { Check } from 'lucide-react';

export default function OptionButton({
  id,
  text,
  letterIndex = 'A',
  numberIndex = 1,
  isSelected = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(id)}
      className={`group relative w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 sm:gap-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        isSelected
          ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-500 shadow-md shadow-brand-500/10'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 shadow-sm'
      }`}
    >
      {/* Option Key Badge & Radio Indicator */}
      <div
        className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 ${
          isSelected
            ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30 scale-105'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
        }`}
      >
        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : letterIndex}
      </div>

      {/* Option Text */}
      <div className="flex-1 pt-0.5">
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isSelected
              ? 'text-brand-950 dark:text-brand-100 font-semibold'
              : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
          }`}
        >
          {text}
        </p>
      </div>

      {/* Keyboard Hint indicator on desktop */}
      <span className="hidden sm:inline-flex shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
        key {numberIndex}
      </span>
    </button>
  );
}
