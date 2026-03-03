import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

const AdminPanel = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token || user?.role !== 'admin') {
      setError('You are not authorized to view this page.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedUsers = await adminService.getAllUsers(token);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users.');
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [token, user?.role]);

  const handleChangeRole = async (userId: string, currentRole: 'admin' | 'user') => {
    if (!token) {
      toast.error('Authentication token not found.');
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    try {
      await adminService.updateUserRole(userId, newRole, token);
      toast.success(`User role changed to ${newRole} successfully!`);
      fetchUsers(); // Re-fetch users to update the UI
    } catch (err) {
      console.error('Failed to change user role:', err);
      toast.error((err as Error).message || 'Failed to change user role.');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!token) {
      toast.error('Authentication token not found.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone and will delete all associated data.`)) {
      try {
        await adminService.deleteUser(userId, token);
        toast.success(`User "${username}" deleted successfully!`);
        fetchUsers(); // Re-fetch users to update the UI
      } catch (err) {
        console.error('Failed to delete user:', err);
        toast.error((err as Error).message || 'Failed to delete user.');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return <div className="text-center mt-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-center mt-8 text-red-500">Access Denied: Only administrators can view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Admin Panel - User Management</h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-700 dark:to-gray-900 text-white">
              <th className="px-6 py-3 border-b-2 border-indigo-700 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 border-b-2 border-indigo-700 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-indigo-700 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 border-b-2 border-indigo-700 dark:border-gray-600 text-left text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{u.username}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{u.email}</p>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                      u.role === 'admin'
                        ? 'bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100'
                        : 'bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-blue-100'
                    }`}
                  >
                    <span className="relative">{u.role}</span>
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                  {user?.id !== u.id && ( // Prevent admin from changing their own role
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleChangeRole(u.id, u.role)}
                        className="px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200
                                   bg-indigo-500 hover:bg-indigo-600
                                   dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200
                                   bg-red-500 hover:bg-red-600
                                   dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Delete User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
