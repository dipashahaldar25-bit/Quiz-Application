import React from 'react';
import { Heart, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 mt-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <Code2 className="w-4 h-4 text-brand-500" />
          <span>QuizCraft — Self-Contained React Quiz Platform</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using React, Tailwind CSS & JSON Data</span>
        </div>
      </div>
    </footer>
  );
}
