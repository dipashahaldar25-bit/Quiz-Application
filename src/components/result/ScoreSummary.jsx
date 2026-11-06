import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, AlertCircle, Clock, Award, Sparkles } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function ScoreSummary({ results }) {
  const {
    score,
    totalQuestions,
    correctCount,
    wrongCount,
    skippedCount,
    percentage,
    passingPercentage,
    isPassed,
    formattedTime,
  } = results;

  // Trigger celebratory confetti if passed
  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [isPassed]);

  // Circle gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let tierTitle = 'Quiz Completed!';
  let tierSubtitle = 'Keep practicing to master Computer Science fundamentals.';
  let badgeVariant = 'amber';

  if (percentage >= 90) {
    tierTitle = 'Computer Science Master! 🏆';
    tierSubtitle = 'Flawless performance! You have deep mastery of core computer science.';
    badgeVariant = 'emerald';
  } else if (percentage >= 70) {
    tierTitle = 'Great Achievement! 🌟';
    tierSubtitle = 'Strong grasp of core data structures, algorithms, and system concepts.';
    badgeVariant = 'brand';
  } else if (isPassed) {
    tierTitle = 'You Passed! 🎉';
    tierSubtitle = 'Good work! Review the explanations below to fill in any gaps.';
    badgeVariant = 'emerald';
  }

  return (
    <Card className="p-6 sm:p-8 md:p-10 text-center relative overflow-hidden mb-8 shadow-lg">
      {/* Subtle ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-gradient-to-b from-brand-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Tier Badge */}
      <div className="inline-flex mb-4">
        <Badge
          variant={badgeVariant}
          size="lg"
          icon={isPassed ? Sparkles : AlertCircle}
        >
          {isPassed ? `Passed (≥ ${passingPercentage}%)` : `Did Not Pass (< ${passingPercentage}%)`}
        </Badge>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
        {tierTitle}
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8">
        {tierSubtitle}
      </p>

      {/* Circular Gauge */}
      <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <circle
            cx="65"
            cy="65"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            className={`transition-all duration-1000 ease-out ${
              isPassed
                ? 'stroke-emerald-500 dark:stroke-emerald-400'
                : 'stroke-amber-500 dark:stroke-amber-400'
            }`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {score} of {totalQuestions} Correct
          </span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl mx-auto">
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col items-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5" />
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {correctCount}
          </span>
          <span className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/80">
            Correct
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex flex-col items-center">
          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mb-1.5" />
          <span className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            {wrongCount}
          </span>
          <span className="text-xs font-semibold text-rose-600/80 dark:text-rose-400/80">
            Incorrect
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center">
          <AlertCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 mb-1.5" />
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {skippedCount}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Skipped
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex flex-col items-center">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5" />
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {formattedTime}
          </span>
          <span className="text-xs font-semibold text-amber-600/80 dark:text-amber-400/80">
            Time Taken
          </span>
        </div>
      </div>
    </Card>
  );
}
