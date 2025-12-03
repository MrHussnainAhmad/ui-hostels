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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading admin dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Admin Dashboard
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Platform Overview
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Monitor verifications, reports, fees and users across the platform.
          </p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/verifications"
            className="border border-gray-100 bg-white px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-500 font-light mb-1">
              Pending Verifications
            </p>
            <p className="text-2xl font-light text-yellow-700">
              {stats.pendingVerifications}
            </p>
          </Link>

          <Link
            to="/admin/reports"
            className="border border-gray-100 bg-white px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-500 font-light mb-1">
              Open Reports
            </p>
            <p className="text-2xl font-light text-red-700">
              {stats.openReports}
            </p>
          </Link>

          <Link
            to="/admin/fees"
            className="border border-gray-100 bg-white px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-500 font-light mb-1">
              Pending Fees
            </p>
            <p className="text-2xl font-light text-blue-700">
              {stats.pendingFees}
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="border border-gray-100 bg-white px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-500 font-light mb-1">
              Total Users
            </p>
            <p className="text-2xl font-light text-green-700">
              {stats.totalUsers}
            </p>
          </Link>
        </section>

        {/* Quick Actions */}
        <section className="border border-gray-100 bg-white px-6 py-6">
          <h2 className="text-sm font-light text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link
              to="/admin/verifications"
              className="px-4 py-4 text-center border border-yellow-200 bg-yellow-50 text-yellow-800 font-light hover:bg-yellow-100 transition-colors"
            >
              Review Verifications
            </Link>
            <Link
              to="/admin/reports"
              className="px-4 py-4 text-center border border-red-200 bg-red-50 text-red-800 font-light hover:bg-red-100 transition-colors"
            >
              Handle Reports
            </Link>
            <Link
              to="/admin/fees"
              className="px-4 py-4 text-center border border-blue-200 bg-blue-50 text-blue-800 font-light hover:bg-blue-100 transition-colors"
            >
              Review Fees
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-4 text-center border border-green-200 bg-green-50 text-green-800 font-light hover:bg-green-100 transition-colors"
            >
              Manage Users
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;