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
    if (!confirm('Are you sure you want to terminate this user?')) return;

    try {
      await usersApi.terminateUser(userId);
      loadUsers();
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
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create sub-admin');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSubAdmin = async (userId: string) => {
    if (!confirm('Delete this sub-admin? This action cannot be undone.')) return;

    try {
      await authApi.deleteSubAdmin(userId);
      loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SUBADMIN">Sub-Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="STUDENT">Student</option>
          </select>
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Sub-Admin
            </button>
          )}
        </div>
      </div>

      {/* Create Sub-Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Sub-Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newSubAdmin.email}
                  onChange={(e) => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="subadmin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newSubAdmin.password}
                  onChange={(e) => setNewSubAdmin({ ...newSubAdmin, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="flex space-x-4 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSubAdmin({ email: '', password: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubAdmin}
                  disabled={creating}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {users.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No users found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className={user.isTerminated ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'SUBADMIN'
                            ? 'bg-indigo-100 text-indigo-800'
                            : user.role === 'MANAGER'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isTerminated ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Terminated
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Don't allow terminating admins or already terminated users */}
                        {!user.isTerminated && user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleTerminate(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Terminate
                          </button>
                        )}
                        {/* Only ADMIN can delete SUBADMIN */}
                        {currentUser?.role === 'ADMIN' && user.role === 'SUBADMIN' && (
                          <button
                            onClick={() => handleDeleteSubAdmin(user.id)}
                            className="text-red-600 hover:text-red-900"
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
          )}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'ADMIN').length}
          </p>
          <p className="text-sm text-gray-500">Admins</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            {users.filter((u) => u.role === 'SUBADMIN').length}
          </p>
          <p className="text-sm text-gray-500">Sub-Admins</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === 'MANAGER').length}
          </p>
          <p className="text-sm text-gray-500">Managers</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.role === 'STUDENT').length}
          </p>
          <p className="text-sm text-gray-500">Students</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;