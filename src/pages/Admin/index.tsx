import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';
import './Admin.css';

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
      const fetchedUsers = await adminService.getAllUsers();
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
      await adminService.updateUserRole(userId, newRole);
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
        await adminService.deleteUser(userId);
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
    return <div className="admin-message">Loading users...</div>;
  }

  if (error) {
    return <div className="admin-message admin-error-message">{error}</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="admin-message admin-error-message">Access Denied: Only administrators can view this page.</div>;
  }

  return (
<div className="admin-panel-container">
      <h1 className="admin-title">Admin Panel - User Management</h1>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr className="admin-table-header-row">
              <th className="admin-table-header-cell">
                Username
              </th>
              <th className="admin-table-header-cell">
                Email
              </th>
              <th className="admin-table-header-cell">
                Role
              </th>
              <th className="admin-table-header-cell">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className={`admin-table-row ${index % 2 === 0 ? 'admin-table-row--even' : 'admin-table-row--odd'}`}>
                <td className="admin-table-cell">
                  <p className="admin-table-cell-text">{u.username}</p>
                </td>
                <td className="admin-table-cell">
                  <p className="admin-table-cell-text">{u.email}</p>
                </td>
                <td className="admin-table-cell">
                  <span
                    className={`admin-role-badge ${
                      u.role === 'admin' ? 'admin-role-badge--admin' : 'admin-role-badge--user'
                    }`}
                  >
                    <span className="relative">{u.role}</span>
                  </span>
                </td>
                <td className="admin-table-cell">
                  {user?.id !== u.id && ( 
                    <div className="admin-actions">
                      <button
                        onClick={() => handleChangeRole(u.id, u.role)}
                        className="admin-action-button admin-action-button--promote"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="admin-action-button admin-action-button--delete"
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
