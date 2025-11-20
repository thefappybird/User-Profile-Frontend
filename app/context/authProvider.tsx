import { createContext, useContext, useState, type ReactNode } from "react";
import { authService } from "~/utils/authService";
import type { User } from "~/utils/types/user";

interface AuthContextType {
  user: User | null;
  setUser: (User: User) => void;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    return response.message;
  };

  const logout = async () => {
    const response = await authService.logout();
    return response.message;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
