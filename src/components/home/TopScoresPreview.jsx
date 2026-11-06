import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, ArrowRight, User } from 'lucide-react';
import { getLeaderboard } from '../../utils/localStorageHelpers';
import Card from '../common/Card';

export default function TopScoresPreview() {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const scores = getLeaderboard().slice(0, 3);
    setTopScores(scores);
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center justify-center border border-amber-300 dark:border-amber-700">
          1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center border border-slate-300 dark:border-slate-700">
          2
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 font-black text-xs flex items-center justify-center border border-orange-300 dark:border-orange-700">
        3
      </span>
    );
  };

  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Hall of Fame
            </h2>
          </div>
          <Link
            to="/leaderboard"
            className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 group"
          >
            Full Leaderboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {topScores.length === 0 ? (
          <Card className="p-8 text-center bg-slate-50/50 dark:bg-slate-900/40">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Medal className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
              No scores recorded yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Take the quiz and be the very first player to set the record on the leaderboard!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topScores.map((score, index) => (
              <Card
                key={score.id}
                hover
                className="p-5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  {getRankBadge(index)}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                    {score.percentage}%
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {score.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <span>Score: <strong className="text-slate-800 dark:text-slate-200">{score.score}/{score.totalQuestions}</strong></span>
                  <span>Time: <strong className="text-slate-800 dark:text-slate-200">{score.formattedTime}</strong></span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
