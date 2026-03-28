// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { profileService } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'collective_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'active' | 'inactive' | null
  const [isHydrating, setIsHydrating] = useState(!!localStorage.getItem(TOKEN_KEY));

  // Hydrate session on mount — validates stored token against the API
  useEffect(() => {
    if (!token) {
      setIsHydrating(false);
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      try {
        const [profileRes, subRes] = await Promise.all([
          profileService.getProfile(),
          profileService.getMySubscription(),
        ]);

        if (cancelled) return;

        setUser(profileRes.profile);
        setSubscriptionStatus(subRes.subscription?.status === 'active' ? 'active' : 'inactive');
      } catch {
        // Token expired or invalid — wipe it
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setSubscriptionStatus(null);
        }
      } finally {
        if (!cancelled) setIsHydrating(false);
      }
    };

    hydrate();
    return () => { cancelled = true; };
  }, [token]);

  const login = useCallback((newToken, userData) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(userData ?? null);
    // Subscription will be hydrated by the useEffect above once token changes
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSubscriptionStatus(null);
  }, []);

  const updateSubscription = useCallback((status) => {
    setSubscriptionStatus(status);
  }, []);

  const isAuthenticated = !!token && !isHydrating;

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    isHydrating,
    subscriptionStatus,
    login,
    logout,
    updateSubscription,
  }), [user, token, isAuthenticated, isHydrating, subscriptionStatus, login, logout, updateSubscription]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
