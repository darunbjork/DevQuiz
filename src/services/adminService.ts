import { API_BASE_URL } from '../config/api';
import type { User } from '../types'; // Use import type for type-only imports

export const adminService = {
  /**
   * Changes a user's role to either 'admin' or 'user'.
   * @param userId The ID of the user whose role is being changed.
   * @param role The new role ('admin' or 'user').
   * @param adminToken The JWT of the currently logged-in administrator.
   * @returns A promise that resolves if the role change was successful, or rejects with an error.
   */
  changeUserRole: async (
    userId: string,
    role: 'admin' | 'user',
    adminToken: string
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change user role.');
      }
      // No content to return, just resolve if successful
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  },

  /**
   * Fetches a list of all registered users.
   * @param adminToken The JWT of the currently logged-in administrator.
   * @returns A promise that resolves with an array of User objects, or rejects with an error.
   */
  getAllUsers: async (adminToken: string): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users.');
      }

      const users: User[] = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};
