import { create } from 'zustand';
import { api } from '../utils/axios';

interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  githubUrl?: string;
  bio?: string;
  role?: string;
  techStack?: string[];
  isProfileComplete?: boolean;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.get('/auth/logout');
      set({ user: null });
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/me', data);
      set({ user: response.data.user });
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  }
}));
