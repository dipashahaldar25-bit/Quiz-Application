import React, { createContext, useState, useEffect, useCallback } from 'react';
import { DEMO_ACCOUNTS, sanitizeUser, isValidEmail } from '../utils/authHelpers';

export { DEMO_ACCOUNTS };
export const AuthContext = createContext(null);

const AUTH_USER_KEY = 'quizapp_auth_user';
const REGISTERED_USERS_KEY = 'quizapp_registered_users';

function getStoredRegisteredUsers() {
  if (typeof window === 'undefined') return DEMO_ACCOUNTS;
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEMO_ACCOUNTS));
      return DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_ACCOUNTS;
  } catch (err) {
    console.error('Failed to load registered users:', err);
    return DEMO_ACCOUNTS;
  }
}

function getStoredActiveUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse active user:', err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredActiveUser);
  const [registeredUsers, setRegisteredUsers] = useState(getStoredRegisteredUsers);
  const [isLoading, setIsLoading] = useState(false);

  // Sync active user across storage events (tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === AUTH_USER_KEY) {
        setUser(getStoredActiveUser());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Log in with email and password
   */
  const login = useCallback(
    async ({ email, password, rememberMe = true }) => {
      setIsLoading(true);
      // Simulate brief network latency for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 350));

      const cleanEmail = email?.trim().toLowerCase();
      const allUsers = getStoredRegisteredUsers();

      const matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      );

      if (!matchedUser) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Invalid email or password. Please verify your credentials or create an account.',
        };
      }

      // Safe user object without exposing password in session
      const { password: _, ...safeUser } = matchedUser;
      setUser(safeUser);

      try {
        if (rememberMe) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
          sessionStorage.removeItem(AUTH_USER_KEY);
        } else {
          sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
          localStorage.removeItem(AUTH_USER_KEY);
        }
      } catch (err) {
        console.error('Failed to save user session:', err);
      }

      setIsLoading(false);
      return { success: true, user: safeUser };
    },
    []
  );

  /**
   * Register a new user
   */
  const signup = useCallback(
    async ({ name, email, password, role = 'Quiz Challenger' }) => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 350));

      const cleanEmail = email?.trim().toLowerCase();
      const cleanName = name?.trim();

      if (!cleanName || !cleanEmail || !password) {
        setIsLoading(false);
        return { success: false, error: 'Please provide all required fields.' };
      }

      const allUsers = getStoredRegisteredUsers();
      const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (existing) {
        setIsLoading(false);
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in instead.',
        };
      }

      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: cleanName,
        email: cleanEmail,
        password,
        role,
        avatar: null,
        joinedDate: new Date().toISOString().split('T')[0],
      };

      const updatedUsers = [...allUsers, newUser];
      try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
        setRegisteredUsers(updatedUsers);
      } catch (err) {
        console.error('Failed to persist new user:', err);
      }

      const { password: _, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));

      setIsLoading(false);
      return { success: true, user: safeUser };
    },
    []
  );

  /**
   * One-click login for demo accounts
   */
  const quickLoginDemo = useCallback(async (accountIndex = 0) => {
    const demo = DEMO_ACCOUNTS[accountIndex] || DEMO_ACCOUNTS[0];
    return login({ email: demo.email, password: demo.password, rememberMe: true });
  }, [login]);

  /**
   * Log out active user
   */
  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem(AUTH_USER_KEY);
    } catch (err) {
      console.error('Failed to clear user session:', err);
    }
  }, []);

  /**
   * Update current profile details
   */
  const updateProfile = useCallback(
    (updates) => {
      if (!user) return;
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
        const allUsers = getStoredRegisteredUsers().map((u) =>
          u.id === user.id ? { ...u, ...updates } : u
        );
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(allUsers));
        setRegisteredUsers(allUsers);
      } catch (err) {
        console.error('Failed to update profile:', err);
      }
    },
    [user]
  );

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    signup,
    quickLoginDemo,
    logout,
    updateProfile,
    demoAccounts: DEMO_ACCOUNTS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
