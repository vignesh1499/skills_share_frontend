'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken, login, logout, removeAuthToken } from '../services/auth.service'; // Ensure login/logout are correctly imported
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check and set token on mount
  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) {
      const isExpired = checkTokenExpiry(storedToken);
      if (isExpired) {
        logoutAndRedirect();
      } else {
        setToken(storedToken);
      }
    } else {
      logoutAndRedirect();
    }
  }, []);

  // Revalidate token on change
  useEffect(() => {
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload) {
      logoutAndRedirect();
      return;
    }

    const expiresAt = payload.exp * 1000;
    if (Date.now() > expiresAt) {
      logoutAndRedirect();
    } else {
      const timeout = expiresAt - Date.now();
      const timer = setTimeout(logoutAndRedirect, timeout);
      return () => clearTimeout(timer);
    }
  }, [token]);

  const logoutAndRedirect = () => {
    logout(); // from auth.service
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}


const parseJwt = (token: string): { exp: number } | null => {
  try {
    const base64 = token.split('.')[1];
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch {
    return null;
  }
};

const checkTokenExpiry = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return Date.now() > payload.exp * 1000;
};
