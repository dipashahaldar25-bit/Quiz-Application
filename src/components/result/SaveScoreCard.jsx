import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Check, ArrowRight, BookmarkPlus, User } from 'lucide-react';
import { saveLeaderboardEntry } from '../../utils/localStorageHelpers';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Button from '../common/Button';

export default function SaveScoreCard({ results, quizMeta }) {
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState(user?.name || '');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.name && !playerName) {
      setPlayerName(user.name);
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) {
      setError('Please enter a display name to save your score.');
      return;
    }

    saveLeaderboardEntry({
      name: trimmed,
      score: results.score,
      totalQuestions: results.totalQuestions,
      percentage: results.percentage,
      totalDurationSeconds: results.totalDurationSeconds,
      formattedTime: results.formattedTime,
    });

    setIsSaved(true);
    setError('');
  };

  return (
    <Card className="p-6 sm:p-7 mb-8 bg-gradient-to-r from-brand-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90 border-brand-200/80 dark:border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Save Score to Hall of Fame
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Record your {results.percentage}% score in the browser's persistent leaderboard.
            </p>
          </div>
        </div>

        {isSaved ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Check className="w-4 h-4 stroke-[3]" />
              Score Recorded!
            </span>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View Board <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
          >
            <div>
              <input
                type="text"
                placeholder="Enter your name..."
                maxLength={24}
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full sm:w-56 px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
              {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={BookmarkPlus}
              iconPosition="left"
              className="shrink-0"
            >
              Save Score
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}
