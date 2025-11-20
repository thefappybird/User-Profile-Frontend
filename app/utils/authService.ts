import type {
  LoginResponse,
  LogoutResponse,
  RegisterInput,
  RegisterResponse,
  User,
} from "./types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");
      return response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async register(formData: RegisterInput): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Registration failed");
    return response.json();
  },

  async logout(): Promise<LogoutResponse> {
    const response = await fetch(`${API_BASE_URL}/auth-user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Logout failed");
    return response.json();
  },
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth-user`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Login failed");
      return response.json();
    } catch (error) {
      return null;
    }
  },
};
