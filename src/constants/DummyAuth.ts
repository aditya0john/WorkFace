/**
 * TEMPORARY dummy auth data.
 *
 * This is the only file that should need to change when real authentication
 * (API/local DB) replaces this stage's hardcoded sign-in. Nothing else in the
 * app should import raw credentials — go through `validateCredentials` below.
 */

import { useAuthStore } from "../store/useAuthStore";
import { useStaffStore } from "../store/useStaffStore";

export type UserRole = 'admin' | 'staff';

interface DummyUser {
  employeeId: string;
  password: string;
  role: UserRole;
}

const DUMMY_USERS: DummyUser[] = [
  { employeeId: 'ADMIN', password: 'password', role: 'admin' },
];

export interface ValidatedUser {
  employeeId: string;
  role: UserRole;
  staffId?: string;
}

/**
 * Checks employeeId + password against the dummy user list.
 * Employee ID match is case-insensitive; password is checked as-is.
 * Returns the matched user, or null if credentials are invalid.
 */
export function validateCredentials(employeeId: string, password: string): ValidatedUser | null {
  const normalizedInputId = employeeId.trim().toLowerCase();

  const adminMatch = DUMMY_USERS.find(
    (u) => u.employeeId.toLowerCase() === employeeId.trim().toLowerCase() && u.password === password
  );

  if (adminMatch) {
    useAuthStore.getState().setUser({
      role: 'admin',
      adminId: 'ADMIN',
    });
    return { employeeId: adminMatch.employeeId, role: adminMatch.role };
  }

  // 2. Check dynamic Staff members from Zustand Store
  // .getState() lets us read the store synchronously outside of React hooks
  const staffList = useStaffStore.getState().staffList;

  const staffMatch = staffList.find(
    (s) => s.employeeId.toLowerCase() === normalizedInputId
  );

  if (staffMatch && password === "password") {
    useAuthStore.getState().setUser({
      role: 'staff',
      staffData: staffMatch, // Stores their full profile (name, photo, ID, etc.)
    });
    return {
      employeeId: staffMatch.employeeId,
      role: 'staff',
      staffId: staffMatch.id // Pass the unique ID to help load their specific dashboard
    };
  }

  // No match found in either
  return null;
}