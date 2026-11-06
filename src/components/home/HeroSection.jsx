import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Award, HelpCircle, Flame, Trophy, Sparkles } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function HeroSection() {
  const navigate = useNavigate();
  const { quizMeta, startQuiz } = useQuiz();
  const { user, isAuthenticated } = useAuth();

  const handleStart = () => {
    startQuiz();
    navigate('/quiz');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:py-16 md:py-20">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Topic Badge & User Welcome */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
          <Badge variant="brand" size="lg" icon={Flame}>
            {quizMeta.topic || 'Computer Science'} • {quizMeta.difficulty || 'Intermediate'} Challenge
          </Badge>
          {isAuthenticated && (
            <Badge variant="emerald" size="lg" icon={Sparkles}>
              Welcome, {user.name.split(' ')[0]}!
            </Badge>
          )}
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-6 leading-[1.15]">
          Master{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-500 to-amber-500">
            {quizMeta.title || 'JavaScript Fundamentals'}
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {quizMeta.description ||
            'Test your mastery of core JavaScript concepts, event loop mechanics, closures, and modern ES6+ features.'}
        </p>

        {/* Meta Stats Pills */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto mb-10">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {quizMeta.totalQuestions || 10}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Questions</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {quizMeta.timePerQuestion || 30}s
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Per Question</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm flex flex-col items-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {quizMeta.passingPercentage || 60}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pass Mark</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={handleStart}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 text-base font-semibold px-8 py-4"
          >
            Start Quiz Now
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/leaderboard')}
            icon={Trophy}
            iconPosition="left"
            className="w-full sm:w-auto text-base"
          >
            View Leaderboard
          </Button>
        </div>
      </div>
    </section>
  );
}
