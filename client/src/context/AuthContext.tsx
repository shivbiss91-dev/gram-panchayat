import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { name: string; email: string; mobile: string; address: string }) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch current user if token exists on initial load
  const refreshUser = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.warn('Session verification failed:', err);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    const res = await authApi.login({ identifier, password });
    if (res.token && res.user) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData: any): Promise<User> => {
    const res = await authApi.register(formData);
    if (res.token && res.user) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    try {
      authApi.logout().catch(() => {});
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }
  };

  const updateProfile = async (data: { name: string; email: string; mobile: string; address: string }) => {
    const res = await authApi.updateProfile(data);
    if (res.data) {
      setUser((prev) => (prev ? { ...prev, ...res.data } : res.data!));
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    await authApi.changePassword(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
