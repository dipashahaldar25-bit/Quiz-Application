import React from 'react';
import { CheckCircle2, Timer, Award } from 'lucide-react';
import Card from '../common/Card';

const steps = [
  {
    step: '01',
    title: 'Answer the Questions',
    description:
      'Engage with 10 carefully crafted JavaScript questions covering closures, scopes, event loop, and tricky edge cases.',
    icon: CheckCircle2,
    color: 'from-blue-500 to-indigo-600',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
  },
  {
    step: '02',
    title: 'Beat the Timer',
    description:
      'Each question gives you 30 seconds. Keep your focus sharp; unanswered questions will auto-advance when time expires.',
    icon: Timer,
    color: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    step: '03',
    title: 'Analyze & Leaderboard',
    description:
      'Review detailed answers with educational explanations, see your percentage score, and save your spot on the leaderboard.',
    icon: Award,
    color: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Three simple steps to test your JavaScript fluency and earn your rank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                hover
                className="p-6 relative flex flex-col justify-between group overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-3xl font-black text-slate-200/70 dark:text-slate-800/70 select-none">
                  {item.step}
                </div>
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
