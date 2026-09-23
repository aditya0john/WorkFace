import { create } from 'zustand';
import type { Staff } from '../types/type';

interface StaffState {
  staffList: Staff[];
  addStaff: (staff: Staff) => void;
}

/**
 * In-memory only, as scoped for this stage — no persistence, no backend.
 * Data resets whenever the app reloads.
 */
export const useStaffStore = create<StaffState>((set) => ({
  staffList: [],
  addStaff: (staff) =>
    set((state) => ({ staffList: [...state.staffList, staff] })),
}));