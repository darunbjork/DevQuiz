import { apiClient } from './apiClient'; 
import type { User } from '../types';

export const adminService = {
  getAllUsers: async (): Promise<User[]> => { 
    const response = await apiClient.fetchWithAuth('/api/admin/users', { 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    const users: User[] = await response.json();
    return users;
  },

  updateUserRole: async (userId: string, role: 'admin' | 'user'): Promise<User> => { 
    const response = await apiClient.fetchWithAuth(`/api/admin/users/${userId}/role`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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

  deleteUser: async (userId: string): Promise<{ message: string }> => { 
    const response = await apiClient.fetchWithAuth(`/api/admin/users/${userId}`, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    const result: { message: string } = await response.json();
    return result;
  },
};
