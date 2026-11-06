import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Lightbulb, Check, X } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerReviewItem({ item, index }) {
  const {
    questionText,
    options,
    selectedOptionId,
    correctOptionId,
    status, // 'correct' | 'wrong' | 'skipped'
    explanation,
  } = item;

  let badgeVariant = 'slate';
  let badgeLabel = 'Skipped';
  let BadgeIcon = AlertCircle;

  if (status === 'correct') {
    badgeVariant = 'emerald';
    badgeLabel = 'Correct';
    BadgeIcon = CheckCircle2;
  } else if (status === 'wrong') {
    badgeVariant = 'rose';
    badgeLabel = 'Incorrect';
    BadgeIcon = XCircle;
  }

  return (
    <Card className="p-5 sm:p-7 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700">
      {/* Top Header: Question Index + Status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Question {index + 1}
        </span>
        <Badge variant={badgeVariant} size="sm" icon={BadgeIcon}>
          {badgeLabel}
        </Badge>
      </div>

      {/* Question Text */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-5 leading-snug whitespace-pre-line">
        {questionText}
      </h3>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-2.5 mb-5">
        {options.map((option, optIdx) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = correctOptionId === option.id;

          let optionStyle = 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300';
          let letterStyle = 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

          if (isCorrect) {
            // Correct option is always highlighted green in review
            optionStyle = 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/50';
            letterStyle = 'bg-emerald-600 text-white';
          } else if (isSelected && !isCorrect) {
            // Selected but wrong option highlighted red
            optionStyle = 'bg-rose-50/90 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 font-semibold ring-1 ring-rose-500/50';
            letterStyle = 'bg-rose-600 text-white';
          }

          return (
            <div
              key={option.id}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${letterStyle}`}>
                  {LETTERS[optIdx] || option.id.toUpperCase()}
                </span>
                <span className="leading-relaxed">{option.text}</span>
              </div>

              {/* Tag indicator */}
              <div className="shrink-0 flex items-center gap-1.5">
                {isCorrect && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                    <Check className="w-3 h-3 stroke-[3]" /> Correct Answer
                  </span>
                )}
                {isSelected && !isCorrect && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                    <X className="w-3 h-3 stroke-[3]" /> Your Answer
                  </span>
                )}
                {isSelected && isCorrect && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                    Your Choice
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Box */}
      {explanation && (
        <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-slate-800/80 border border-brand-100 dark:border-slate-700/80 flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 block mb-1">
              Explanation & Concept
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
