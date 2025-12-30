import type { User } from '../types';

const USERS_KEY = 'study_app_users';
const CURRENT_USER_KEY = 'study_app_current_user';

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const findUserById = (id: number): User | undefined => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (userId: number, updates: Partial<User>): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
};

export const setCurrentUser = (userId: number): void => {
  localStorage.setItem(CURRENT_USER_KEY, userId.toString());
};

export const getCurrentUserId = (): number | null => {
  const id = localStorage.getItem(CURRENT_USER_KEY);
  return id ? parseInt(id) : null;
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};