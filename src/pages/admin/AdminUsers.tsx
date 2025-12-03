import React, { useEffect, useState } from 'react';
import { usersApi, authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({ email: '', password: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersApi.getAllUsers(filter || undefined);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (userId: string) => {
    if (!window.confirm('Are you sure you want to terminate this user?')) return;

    try {
      await usersApi.terminateUser(userId);
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to terminate');
    }
  };

  const handleCreateSubAdmin = async () => {
    if (!newSubAdmin.email || !newSubAdmin.password) {
      alert('Please fill all fields');
      return;
    }

    setCreating(true);
    try {
      await authApi.createSubAdmin(newSubAdmin);
      setShowCreateModal(false);
      setNewSubAdmin({ email: '', password: '' });
      alert('Sub-admin created successfully!');
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create sub-admin');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSubAdmin = async (userId: string) => {
    if (!window.confirm('Delete this sub-admin? This action cannot be undone.'))
      return;

    try {
      await authApi.deleteSubAdmin(userId);
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const countByRole = (role: string) =>
    users.filter((u) => u.role === role).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading users...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
              Admin • Users
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              Users Management
            </h1>
            <p className="text-sm text-gray-500 font-light">
              View and manage all platform users and their roles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 rounded-lg focus:outline-none focus:border-gray-900 font-light"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="SUBADMIN">Sub-Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STUDENT">Student</option>
            </select>
            {currentUser?.role === 'ADMIN' && (
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gray-900 text-white text-xs sm:text-sm font-light rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Sub-Admin
              </button>
            )}
          </div>
        </header>

        {/* Create Sub-Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="w-full max-w-md border border-gray-200 bg-white px-6 py-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">
                Create Sub-Admin
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newSubAdmin.email}
                    onChange={(e) =>
                      setNewSubAdmin({
                        ...newSubAdmin,
                        email: e.target.value,
                      })
                    }
                    placeholder="subadmin@example.com"
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newSubAdmin.password}
                    onChange={(e) =>
                      setNewSubAdmin({
                        ...newSubAdmin,
                        password: e.target.value,
                      })
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewSubAdmin({ email: '', password: '' });
                    }}
                    className="w-full sm:w-1/2 py-2.5 border border-gray-200 text-xs font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSubAdmin}
                    disabled={creating}
                    className="w-full sm:w-1/2 py-2.5 bg-gray-900 text-white text-xs font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <section className="border border-gray-100 bg-white overflow-hidden">
          {users.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500 font-light">
                No users found for the selected filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className={user.isTerminated ? 'bg-red-50' : ''}
                    >
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900 font-light">
                        {user.email}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-[11px] font-light rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : user.role === 'SUBADMIN'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : user.role === 'MANAGER'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs">
                        {user.isTerminated ? (
                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-light rounded-full bg-red-50 text-red-700 border border-red-200">
                            Terminated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-light rounded-full bg-green-50 text-green-700 border border-green-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500 font-light">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs">
                        <div className="flex flex-wrap gap-2">
                          {!user.isTerminated && user.role !== 'ADMIN' && (
                            <button
                              type="button"
                              onClick={() => handleTerminate(user.id)}
                              className="text-red-700 hover:text-red-900 font-light"
                            >
                              Terminate
                            </button>
                          )}
                          {currentUser?.role === 'ADMIN' &&
                            user.role === 'SUBADMIN' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteSubAdmin(user.id)
                                }
                                className="text-red-700 hover:text-red-900 font-light"
                              >
                                Delete
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Stats Summary */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="border border-gray-100 bg-white px-4 py-4 text-center">
            <p className="text-2xl font-light text-gray-900">
              {users.length}
            </p>
            <p className="text-xs text-gray-500 font-light">
              Total Users
            </p>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 text-center">
            <p className="text-2xl font-light text-purple-700">
              {countByRole('ADMIN')}
            </p>
            <p className="text-xs text-gray-500 font-light">Admins</p>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 text-center">
            <p className="text-2xl font-light text-indigo-700">
              {countByRole('SUBADMIN')}
            </p>
            <p className="text-xs text-gray-500 font-light">
              Sub-Admins
            </p>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 text-center">
            <p className="text-2xl font-light text-blue-700">
              {countByRole('MANAGER')}
            </p>
            <p className="text-xs text-gray-500 font-light">Managers</p>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 text-center">
            <p className="text-2xl font-light text-green-700">
              {countByRole('STUDENT')}
            </p>
            <p className="text-xs text-gray-500 font-light">
              Students
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminUsers;