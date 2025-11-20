export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EditInput {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface LogoutResponse {
  message: string;
}
