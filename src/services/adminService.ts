import { API_BASE_URL } from '../config/api';
import type { User } from '../types';

export const adminService = {
  getAllUsers: async (token: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    const users: User[] = await response.json();
    return users;
  },

  updateUserRole: async (userId: string, role: 'admin' | 'user', token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user role');
    }

    const updatedUser: User = await response.json();
    return updatedUser;
  },

  deleteUser: async (userId: string, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    const result: { message: string } = await response.json();
    return result;
  },
};
