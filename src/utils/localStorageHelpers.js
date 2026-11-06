const LEADERBOARD_KEY = 'quizapp_leaderboard';

/**
 * Retrieves the sorted leaderboard list from localStorage.
 * @returns {Array} Array of leaderboard entries
 */
export function getLeaderboard() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const entries = JSON.parse(raw);
    if (!Array.isArray(entries)) return [];

    // Sort: score desc, then totalDurationSeconds asc, then date desc
    return entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.totalDurationSeconds !== b.totalDurationSeconds) {
        return a.totalDurationSeconds - b.totalDurationSeconds;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (err) {
    console.error('Failed to load leaderboard from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new score entry to localStorage, maintaining top 20 order.
 * @param {Object} entry - { name, score, totalQuestions, percentage, totalDurationSeconds, formattedTime, date }
 * @returns {Array} Updated leaderboard
 */
export function saveLeaderboardEntry(entry) {
  if (typeof window === 'undefined') return [];
  try {
    const current = getLeaderboard();
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: entry.name?.trim() || 'Anonymous Player',
      score: entry.score || 0,
      totalQuestions: entry.totalQuestions || 10,
      percentage: entry.percentage || 0,
      totalDurationSeconds: entry.totalDurationSeconds || 0,
      formattedTime: entry.formattedTime || '0s',
      date: new Date().toISOString(),
    };

    const updated = [...current, newEntry].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.totalDurationSeconds !== b.totalDurationSeconds) {
        return a.totalDurationSeconds - b.totalDurationSeconds;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }).slice(0, 20); // keep top 20

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save score to localStorage:', err);
    return [];
  }
}

/**
 * Clears all leaderboard entries from localStorage.
 */
export function clearLeaderboard() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (err) {
    console.error('Failed to clear leaderboard:', err);
  }
}
