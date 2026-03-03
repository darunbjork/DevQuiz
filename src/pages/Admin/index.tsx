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
  }, [token, user?.role, adminService.getAllUsers]);

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
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel - User Management</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Username
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{u.username}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{u.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      u.role === 'admin' ? 'text-green-900' : 'text-blue-900'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 opacity-50 rounded-full ${
                        u.role === 'admin' ? 'bg-green-200' : 'bg-blue-200'
                      }`}
                    ></span>
                    <span className="relative">{u.role}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                  {user?.id !== u.id && ( // Prevent admin from changing their own role
                    <button
                      onClick={() => handleChangeRole(u.id, u.role)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                    >
                      {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
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
