// This file contains utility functions for managing user data in local storage.
// All functions in this file are defined as "arrow functions," which is a concise way to write functions in modern JavaScript/TypeScript.
import type { User } from '../types';

const USERS_KEY = 'study_app_users';

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};