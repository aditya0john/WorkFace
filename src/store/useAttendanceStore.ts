import { create } from 'zustand';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  fullName: string;
  timestamp: string; // Formatted date string
  confidenceScore: number;
}

interface AttendanceState {
  records: AttendanceRecord[];
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  getRecordsByEmployee: (employeeId: string) => AttendanceRecord[];
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  addRecord: (recordData) => {
    const newRecord: AttendanceRecord = {
      id: `${Date.now()}`,
      ...recordData,
    };
    set((state) => ({ records: [newRecord, ...state.records] }));
  },
  getRecordsByEmployee: (employeeId) => {
    return get().records.filter((r) => r.employeeId === employeeId);
  },
}));