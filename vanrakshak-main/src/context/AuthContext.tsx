import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, RegisterPayload } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isGuest: boolean;
  switchRole: (newRole: UserRole) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginWithCredentials: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const defaultUser: User = {
  id: 'user-ranger',
  username: 'ranger',
  name: 'Forest Ranger',
  role: 'ranger',
  email: 'ranger@forest.gov.in',
  mobileNumber: '+91 98201 44521',
  badgeNumber: 'MH-FR-2024-089',
  division: 'Tadoba-Andhari Tiger Reserve',
  beat: 'Moharli Core Beat',
  emergencyContact: '+91 98201 44000 (Range HQ)',
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  role: 'ranger',
  isAuthenticated: true,
  isGuest: false,
  switchRole: async () => {},
  register: async () => ({ success: false }),
  loginWithCredentials: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
  refreshUser: async () => {},
  logout: async () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    const isSignedOut = localStorage.getItem('vr_signed_out') === 'true';
    if (isSignedOut) {
      setUser(null);
      return;
    }

    try {
      const res = await api.getMe();
      if (res && res.user && res.authenticated) {
        setUser(res.user);
      } else if (res && res.user) {
        setUser(res.user);
      } else {
        setUser(defaultUser);
      }
    } catch (e) {
      setUser(defaultUser);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; message?: string; error?: string }> => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      if (res && res.user) {
        localStorage.removeItem('vr_signed_out');
        setUser(res.user);
        return { success: true, message: res.message || 'Registration successful!' };
      }
      return { success: false, error: 'Registration failed to return user data' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await api.loginWithCredentials(identifier, password);
      if (res && res.user) {
        localStorage.removeItem('vr_signed_out');
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message?: string; error?: string }> => {
    setLoading(true);
    try {
      const res = await api.updateProfile(data);
      if (res && res.user) {
        setUser(res.user);
        return { success: true, message: res.message || 'Profile updated successfully!' };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    setLoading(true);
    try {
      const res = await api.login(newRole);
      localStorage.removeItem('vr_signed_out');
      setUser(res.user);
    } catch (e) {
      console.error('Failed to switch role', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout warning', e);
    }
    localStorage.removeItem('vr_token');
    localStorage.setItem('vr_signed_out', 'true');
    setUser(null);
  };

  const role: UserRole = user?.role || 'ranger';
  const isAuthenticated = Boolean(user && user.id && user.role !== 'guest');
  const isGuest = !isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isGuest,
        switchRole,
        register,
        loginWithCredentials,
        updateProfile,
        refreshUser: loadUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

