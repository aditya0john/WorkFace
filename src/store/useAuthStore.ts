import { create } from 'zustand';
import type { Staff } from '../types/type'; // Adjust path to your type definition

export type UserRole = 'admin' | 'staff';

export interface LoggedInUser {
  role: UserRole;
  staffData?: Staff;      // Full staff profile available instantly if role is 'staff'
  adminId?: string;       // If role is 'admin'
}

interface AuthState {
  user: LoggedInUser | null;
  setUser: (user: LoggedInUser | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: () => set({ user: null }),
}));