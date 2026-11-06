import { useState, useEffect, useCallback } from 'react';
import {
  getLeaderboard,
  saveLeaderboardEntry,
  clearLeaderboard as clearStorageLeaderboard,
} from '../utils/localStorageHelpers';

export function useLeaderboard() {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshScores = useCallback(() => {
    const list = getLeaderboard();
    setScores(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshScores();

    // Listen for storage events across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'quizapp_leaderboard') {
        refreshScores();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshScores]);

  const addScore = useCallback(
    (entry) => {
      const updated = saveLeaderboardEntry(entry);
      setScores(updated);
      return updated;
    },
    []
  );

  const clearScores = useCallback(() => {
    clearStorageLeaderboard();
    setScores([]);
  }, []);

  return {
    scores,
    isLoading,
    addScore,
    clearScores,
    refreshScores,
  };
}
