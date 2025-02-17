import React, { createContext, useContext, useState } from 'react';
import { User, AuthContextType } from '../types/auth';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  fullName: 'John Doe',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock authentication functions - to be replaced with Supabase
  const login = async () => {
    setUser(mockUser);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
