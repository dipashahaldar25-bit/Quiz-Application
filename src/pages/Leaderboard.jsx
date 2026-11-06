import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Trash2,
  ArrowRight,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  Play,
  X,
} from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useQuiz } from '../hooks/useQuiz';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { scores, clearScores } = useLeaderboard();
  const { startQuiz, quizMeta } = useQuiz();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleStartNewQuiz = () => {
    startQuiz();
    navigate('/quiz');
  };

  const handleConfirmClear = () => {
    clearScores();
    setShowClearConfirm(false);
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return 'Recent';
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 font-black text-sm shadow-md shadow-amber-500/20">
          🥇
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-black text-sm shadow-sm">
          🥈
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black text-sm shadow-sm">
          🥉
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs border border-slate-200 dark:border-slate-700">
        #{rank}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex mb-2">
              <Badge variant="amber" size="md" icon={Trophy}>
                Hall of Fame
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Quiz Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              Top recorded attempts stored locally in your browser. Sorted by highest score, then fastest time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Button
              variant="primary"
              onClick={handleStartNewQuiz}
              icon={Play}
              iconPosition="left"
            >
              Take Quiz
            </Button>

            {scores.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setShowClearConfirm(true)}
                icon={Trash2}
                iconPosition="left"
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Clear History
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {scores.length === 0 ? (
          <Card className="p-12 text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Attempts Recorded Yet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Be the very first player to take the {quizMeta?.title || 'Computer Science Fundamentals'} quiz and record your score on the leaderboard!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartNewQuiz}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Start Quiz Now
            </Button>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-5">Rank</th>
                    <th className="py-3.5 px-5">Player Name</th>
                    <th className="py-3.5 px-5">Score</th>
                    <th className="py-3.5 px-5">Accuracy</th>
                    <th className="py-3.5 px-5">Time Spent</th>
                    <th className="py-3.5 px-5">Date Recorded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                  {scores.map((entry, index) => {
                    const rank = index + 1;
                    const isTop3 = rank <= 3;
                    return (
                      <tr
                        key={entry.id || index}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                          rank === 1 ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                        }`}
                      >
                        <td className="py-4 px-5 whitespace-nowrap">
                          {getRankBadge(rank)}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {entry.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {entry.score}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">
                            /{entry.totalQuestions}
                          </span>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                              entry.percentage >= 60
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {entry.percentage}%
                          </span>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                          {entry.formattedTime}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(entry.date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {scores.map((entry, index) => {
                const rank = index + 1;
                return (
                  <Card
                    key={entry.id || index}
                    className="p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {getRankBadge(rank)}
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          {entry.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          entry.percentage >= 60
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {entry.percentage}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        Score: <strong className="text-slate-900 dark:text-white">{entry.score}/{entry.totalQuestions}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{entry.formattedTime}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Clear Leaderboard?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete all {scores.length} score records from your browser's local storage. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleConfirmClear}
              >
                Yes, Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
