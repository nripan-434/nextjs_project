import type { User } from './user.js';

export interface RegisterDTO {
  username?: string;
  email: string;
  password?: string;
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface AuthResponse {
  message?: string;
  user?: User;
}
