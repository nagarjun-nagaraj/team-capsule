
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../services/firebase';

type AuthContextType = {
  currentUser: User | null;
  isManager: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);

  // For demo purposes, we'll simulate a user
  const checkIfManager = (user: User | null) => {
    if (!user) return false;
    return user.email === 'manager@example.com';
  };

  useEffect(() => {
    // Initialize auth state, but don't auto-login a mock user
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo login functionality
    try {
      // Create a mock user based on the email provided
      const mockUser = {
        uid: '123456',
        email: email,
        displayName: email.split('@')[0],
      } as User;
      
      setCurrentUser(mockUser);
      setIsManager(email === 'manager@example.com');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      setIsManager(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,
    isManager,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
