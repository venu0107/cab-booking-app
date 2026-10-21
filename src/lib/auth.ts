'use client';

import { AuthUser, UserRole } from '@/types';

const USERS_KEY = 'bharatride_users';
const SESSION_KEY = 'bharatride_session';

/** A very simple password "hash" for client-side demo purposes.
 *  In production this is handled server-side by Supabase Auth. */
function hashPassword(password: string): string {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = (hash * 33) ^ password.charCodeAt(i);
  }
  return (hash >>> 0).toString(16) + '_' + btoa(password.slice(0, 2) + password.length);
}

function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_KEY + '_secure');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY + '_secure', JSON.stringify(users));
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}

/** Register a new user */
export function registerUser(data: RegisterData): AuthResult {
  const allUsers = getStoredUsers();

  // Check if email already exists
  const exists = allUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (exists) {
    return { success: false, error: 'This email is already registered. Please log in.' };
  }

  // Validate phone
  const cleanPhone = data.phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email: data.email.toLowerCase().trim(),
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    role: data.role,
    createdAt: new Date().toISOString(),
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=f59e0b&color=fff&size=150&bold=true`,
    passwordHash: hashPassword(data.password),
  };

  allUsers.push(newUser);
  saveStoredUsers(allUsers);

  const { passwordHash: _ph, ...authUser } = newUser;
  setSession(authUser);
  return { success: true, user: authUser };
}

/** Login existing user */
export function loginUser(email: string, password: string): AuthResult {
  const allUsers = getStoredUsers();
  const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    return { success: false, error: 'No account found with this email. Please register first.' };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const { passwordHash: _ph, ...authUser } = user;
  setSession(authUser);
  return { success: true, user: authUser };
}

/** Get current logged-in user */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/** Save session */
export function setSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('bharatride_auth_change', { detail: user }));
}

/** Logout */
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('bharatride_auth_change', { detail: null }));
}

/** Update user profile after registration */
export function updateUserProfile(userId: string, updates: Partial<AuthUser>): void {
  const allUsers = getStoredUsers();
  const idx = allUsers.findIndex((u) => u.id === userId);
  if (idx >= 0) {
    allUsers[idx] = { ...allUsers[idx], ...updates };
    saveStoredUsers(allUsers);
    const { passwordHash: _ph, ...authUser } = allUsers[idx];
    setSession(authUser);
  }
}
