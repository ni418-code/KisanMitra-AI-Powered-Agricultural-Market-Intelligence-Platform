import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, User, UserRole } from '../types';
import { apiFetch } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | 'guest';
  loading: boolean;
  loginWithCredentials: (identifier: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string; user?: User }>;
  registerFarmer: (data: {
    name: string;
    phone: string;
    village: string;
    location: string;
    state: string;
    language: Language;
    password: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  registerBuyer: (data: {
    businessName: string;
    phone: string;
    email: string;
    businessType: string;
    location: string;
    state: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  isFarmer: boolean;
  isBuyer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('km_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch('/auth/me');
        setCurrentUser(response.user);
      } catch {
        localStorage.removeItem('km_token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const loginWithCredentials = async (identifier: string, password = '', role?: UserRole) => {
    try {
      const value = identifier.trim();
      if (!value || !password) {
        return { success: false, error: 'Please enter your phone/email and password.' };
      }

      const payload = value.includes('@')
        ? { email: value.toLowerCase(), password }
        : { phone: value.replace(/\D/g, ''), password };

      const response = await apiFetch('/auth/login-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (role && response.user?.role !== role) {
        return { success: false, error: `This account is registered as a ${response.user.role}, not a ${role}.` };
      }

      localStorage.setItem('km_token', response.token);
      setCurrentUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed.' };
    }
  };

  const registerFarmer = async (data: {
    name: string;
    phone: string;
    village: string;
    location: string;
    state: string;
    language: Language;
    password: string;
  }) => {
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name.trim(),
          phone: data.phone.replace(/\D/g, ''),
          role: 'farmer',
          villageOrBusinessName: data.village.trim(),
          location: data.location.trim(),
          state: data.state,
          language: data.language,
          password: data.password,
        }),
      });

      localStorage.setItem('km_token', response.token);
      setCurrentUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed.' };
    }
  };

  const registerBuyer = async (data: {
    businessName: string;
    phone: string;
    email: string;
    businessType: string;
    location: string;
    state: string;
    password: string;
  }) => {
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.businessName.trim(),
          phone: data.phone.replace(/\D/g, ''),
          role: 'buyer',
          villageOrBusinessName: data.businessName.trim(),
          location: data.location.trim(),
          state: data.state,
          language: 'en',
          email: data.email.trim() || undefined,
          businessType: data.businessType.trim(),
          password: data.password,
        }),
      });

      localStorage.setItem('km_token', response.token);
      setCurrentUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed.' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('km_token');
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    currentRole: currentUser?.role || 'guest',
    loading,
    loginWithCredentials,
    registerFarmer,
    registerBuyer,
    logout,
    isFarmer: currentUser?.role === 'farmer',
    isBuyer: currentUser?.role === 'buyer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
