import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { RotateCcw, Home, Trophy, Share2, Check } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import ScoreSummary from '../components/result/ScoreSummary';
import SaveScoreCard from '../components/result/SaveScoreCard';
import AnswerReviewItem from '../components/result/AnswerReviewItem';

export default function Result() {
  const navigate = useNavigate();
  const { status, results, quizMeta, resetQuiz, startQuiz } = useQuiz();
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'skipped'
  const [copied, setCopied] = useState(false);

  // Guard: if user lands here without a submitted quiz, redirect to Home
  if (status !== 'submitted' || !results) {
    return <Navigate to="/" replace />;
  }

  const handleRetake = () => {
    resetQuiz();
    startQuiz();
    navigate('/quiz');
  };

  const handleGoHome = () => {
    resetQuiz();
    navigate('/');
  };

  const handleShare = async () => {
    const text = `🧠 I scored ${results.percentage}% (${results.score}/${results.totalQuestions} correct) on the "${quizMeta.title}" quiz in ${results.formattedTime}! Can you beat my score?`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  const reviewItems = results.reviewItems || [];
  const filteredItems = reviewItems.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Score Summary Card with Circular Ring */}
        <ScoreSummary results={results} />

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              onClick={handleRetake}
              icon={RotateCcw}
              iconPosition="left"
            >
              Retake Quiz
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/leaderboard')}
              icon={Trophy}
              iconPosition="left"
            >
              View Leaderboard
            </Button>

            <Button
              variant="ghost"
              onClick={handleGoHome}
              icon={Home}
              iconPosition="left"
            >
              Home
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={handleShare}
            icon={copied ? Check : Share2}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            {copied ? 'Summary Copied!' : 'Share Result'}
          </Button>
        </div>

        {/* Save to Leaderboard Form Card */}
        <SaveScoreCard results={results} quizMeta={quizMeta} />

        {/* Answer Review Section */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Detailed Answer Review
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Understand the core principles behind every question and choice.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70 text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({reviewItems.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('correct')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'correct'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Correct ({results.correctCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('wrong')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'wrong'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Wrong ({results.wrongCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('skipped')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'skipped'
                    ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Skipped ({results.skippedCount})
              </button>
            </div>
          </div>

          {/* List of Review Items */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <AnswerReviewItem
                key={item.questionId}
                item={item}
                index={index}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
