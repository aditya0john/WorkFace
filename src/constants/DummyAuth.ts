/**
 * TEMPORARY dummy auth data.
 *
 * This is the only file that should need to change when real authentication
 * (API/local DB) replaces this stage's hardcoded sign-in. Nothing else in the
 * app should import raw credentials — go through `validateCredentials` below.
 */

export type UserRole = 'admin' | 'staff';

interface DummyUser {
  employeeId: string;
  password: string;
  role: UserRole;
}

const DUMMY_USERS: DummyUser[] = [
  { employeeId: 'ADMIN001', password: 'admin123', role: 'admin' },
  { employeeId: 'STAFF001', password: 'staff123', role: 'staff' },
];

export interface ValidatedUser {
  employeeId: string;
  role: UserRole;
}

/**
 * Checks employeeId + password against the dummy user list.
 * Employee ID match is case-insensitive; password is checked as-is.
 * Returns the matched user, or null if credentials are invalid.
 */
export function validateCredentials(employeeId: string, password: string): ValidatedUser | null {
  const match = DUMMY_USERS.find(
    (u) => u.employeeId.toLowerCase() === employeeId.trim().toLowerCase() && u.password === password
  );
  if (!match) return null;
  return { employeeId: match.employeeId, role: match.role };
}