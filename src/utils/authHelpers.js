/**
 * Pre-seeded demo accounts for quick testing & evaluation
 */
export const DEMO_ACCOUNTS = [
  {
    id: 'demo-user-1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-15',
  },
  {
    id: 'demo-user-2',
    name: 'Sarah Connor',
    email: 'sarah@cs.edu',
    password: 'password123',
    role: 'CS Researcher',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-02-10',
  },
];

/**
 * Validates email format using standard regex.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Evaluates password strength and returns percentage score and label.
 * @param {string} pass
 * @returns {{ score: number, label: string, color: string }}
 */
export function calculatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200 dark:bg-slate-800' };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 3) return { score: 66, label: 'Good', color: 'bg-amber-500' };
  return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
}

/**
 * Strips password field from user object for safe storage in session.
 * @param {Object} user
 * @returns {Object} Safe user object
 */
export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

