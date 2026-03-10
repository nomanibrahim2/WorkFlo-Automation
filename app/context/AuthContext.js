import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, setUser as storeUser, removeUser, getAuthToken } from '../utils/storage';

const AuthContext = createContext(null);

// ── Mock user for development without Auth0 ──────────────────────
const MOCK_USER = {
  name: 'Demo User',
  email: 'demo@workflo.dev',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for existing user session
  useEffect(() => {
    (async () => {
      try {
        const stored = await getUser();
        if (stored) setUser(stored);
      } catch (e) {
        console.error('Auth load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (userData) => {
    // If userData is null, use mock user (for dev mode)
    const u = userData || MOCK_USER;
    await storeUser(u);
    setUser(u);
  }, []);

  const loginMock = useCallback(async () => {
    await storeUser(MOCK_USER);
    setUser(MOCK_USER);
  }, []);

  const logout = useCallback(async () => {
    await removeUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginMock, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
