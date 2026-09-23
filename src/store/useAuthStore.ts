import { create } from 'zustand';

export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  employeeId: string; // admin_code or staff_code
}

interface AuthState {
  user: AuthUser | null;
  isHydrating: boolean;
  signIn: (employeeId: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

// Lazy import to keep the store file light; authService owns the actual DB/hash work.
import { authenticate } from '../services/auth/authService';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrating: false,

  signIn: async (employeeId, password) => {
    const user = await authenticate(employeeId.trim(), password);
    set({ user });
    return user;
  },

  signOut: () => set({ user: null }),
}));