import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { verificationsApi, reportsApi, feesApi, usersApi } from '../../lib/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    openReports: 0,
    pendingFees: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [verifications, reports, fees, users] = await Promise.all([
        verificationsApi.getAll('PENDING'),
        reportsApi.getAll('OPEN'),
        feesApi.getAll('PENDING'),
        usersApi.getAllUsers(),
      ]);

      setStats({
        pendingVerifications: verifications.data.data.length,
        openReports: reports.data.data.length,
        pendingFees: fees.data.data.length,
        totalUsers: users.data.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/admin/verifications" className="bg-white rounded-lg shadow p-6 hover:shadow-md">
          <h3 className="text-gray-500 text-sm">Pending Verifications</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
        </Link>
        <Link to="/admin/reports" className="bg-white rounded-lg shadow p-6 hover:shadow-md">
          <h3 className="text-gray-500 text-sm">Open Reports</h3>
          <p className="text-3xl font-bold text-red-600">{stats.openReports}</p>
        </Link>
        <Link to="/admin/fees" className="bg-white rounded-lg shadow p-6 hover:shadow-md">
          <h3 className="text-gray-500 text-sm">Pending Fees</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.pendingFees}</p>
        </Link>
        <Link to="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-md">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/verifications"
            className="bg-indigo-100 text-indigo-800 p-4 rounded-md text-center hover:bg-indigo-200"
          >
            Review Verifications
          </Link>
          <Link
            to="/admin/reports"
            className="bg-red-100 text-red-800 p-4 rounded-md text-center hover:bg-red-200"
          >
            Handle Reports
          </Link>
          <Link
            to="/admin/fees"
            className="bg-blue-100 text-blue-800 p-4 rounded-md text-center hover:bg-blue-200"
          >
            Review Fees
          </Link>
          <Link
            to="/admin/users"
            className="bg-green-100 text-green-800 p-4 rounded-md text-center hover:bg-green-200"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;