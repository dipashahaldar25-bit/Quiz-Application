import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto px-4 flex items-center justify-center py-16">
        <Card className="p-8 sm:p-12 text-center shadow-lg w-full">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>

          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 mb-3">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist, may have moved, or is part of a different quiz universe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                icon={Home}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Back to Home
              </Button>
            </Link>
            <Link to="/leaderboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
