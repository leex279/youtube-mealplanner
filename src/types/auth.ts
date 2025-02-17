export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}
