import React, { useEffect, useState } from 'react';
import { feesApi } from '../../lib/api';

const AdminFees: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('PENDING');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    loadFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadFees = async () => {
    setLoading(true);
    try {
      const response = await feesApi.getAll(filter || undefined);
      setFees(response.data.data);
      
      // Calculate stats
      const allResponse = await feesApi.getAll();
      const allFees = allResponse.data.data;
      
      setStats({
        total: allFees.length,
        pending: allFees.filter((f: any) => f.status === 'PENDING').length,
        approved: allFees.filter((f: any) => f.status === 'APPROVED').length,
        rejected: allFees.filter((f: any) => f.status === 'REJECTED').length,
      });
    } catch (error) {
      console.error('Error loading fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    if (!window.confirm(`${status} this fee payment?`)) return;

    setProcessing(id);
    try {
      await feesApi.review(id, { status });
      await loadFees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(null);
    }
  };

  const formatMonth = (month: string) => {
    if (!month) return '-';
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-PK', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'REJECTED':
        return '✗';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading fees...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
              Admin • Fees
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              Monthly Admin Fees
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Review and approve platform fee payments from managers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-light">
                Filter by status
              </span>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 rounded-lg focus:outline-none focus:border-gray-900 font-light min-w-[120px]"
                >
                  <option value="">All Fees</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={loadFees}
              className="px-4 py-2 border border-gray-200 text-sm font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors rounded-lg"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-gray-100 bg-white px-4 py-4 rounded-lg">
            <div className="text-2xl font-light text-gray-900 mb-1">
              {stats.total}
            </div>
            <div className="text-xs text-gray-500 font-light">
              Total Fees
            </div>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 rounded-lg">
            <div className="text-2xl font-light text-yellow-600 mb-1">
              {stats.pending}
            </div>
            <div className="text-xs text-gray-500 font-light">
              Pending
            </div>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 rounded-lg">
            <div className="text-2xl font-light text-green-600 mb-1">
              {stats.approved}
            </div>
            <div className="text-xs text-gray-500 font-light">
              Approved
            </div>
          </div>
          <div className="border border-gray-100 bg-white px-4 py-4 rounded-lg">
            <div className="text-2xl font-light text-red-600 mb-1">
              {stats.rejected}
            </div>
            <div className="text-xs text-gray-500 font-light">
              Rejected
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="border border-blue-200 bg-blue-50 px-6 py-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              ℹ️
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Fee Calculation Rules
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><strong>Regular bookings only:</strong> Fee is Rs. 100 per regular student per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><strong>Urgent bookings excluded:</strong> Urgent bookings are not counted in fee calculation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><strong>No reduction:</strong> Student leaving doesn't reduce fee for that month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span><strong>Monthly basis:</strong> Fees are calculated based on approved regular bookings during the month</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Table / Empty state */}
        <section className="border border-gray-100 bg-white overflow-hidden rounded-lg">
          {fees.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-400 text-2xl">💸</span>
              </div>
              <p className="text-sm text-gray-500 font-light">
                No fees found for the selected filter.
              </p>
              <button
                onClick={() => setFilter('')}
                className="mt-3 px-4 py-2 border border-gray-200 text-sm font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors rounded"
              >
                View All Fees
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hostel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proof
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 font-light">
                            {fee.manager?.user?.email || '-'}
                          </span>
                          <span className="text-xs text-gray-500 font-light">
                            {fee.manager?.fullName || 'Manager'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-light">
                          {fee.hostel?.hostelName || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-light">
                          {formatMonth(fee.month)}
                        </div>
                        <div className="text-xs text-gray-500 font-light">
                          Submitted: {new Date(fee.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-light text-center">
                          {fee.studentCount}
                        </div>
                        <div className="text-xs text-gray-500 font-light text-center">
                          regular students
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(fee.feeAmount)}
                        </div>
                        <div className="text-xs text-gray-500 font-light">
                          @ Rs. 100 per student
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-light">
                          {formatAmount(fee.totalRevenue || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fee.paymentProofImage ? (
                          <a
                            href={fee.paymentProofImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 border border-gray-200 text-xs font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors rounded"
                          >
                            <span>📎</span>
                            View Proof
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 font-light">
                            No proof
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-light border rounded-full ${getStatusClasses(
                            fee.status
                          )}`}
                        >
                          <span className="text-xs">{getStatusIcon(fee.status)}</span>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fee.status === 'PENDING' ? (
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleReview(fee.id, 'APPROVED')
                              }
                              disabled={processing === fee.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-green-200 bg-green-50 text-green-700 text-xs font-light hover:bg-green-100 hover:border-green-300 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>✓</span>
                              {processing === fee.id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleReview(fee.id, 'REJECTED')
                              }
                              disabled={processing === fee.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 text-xs font-light hover:bg-red-100 hover:border-red-300 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>✗</span>
                              {processing === fee.id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 font-light italic">
                            Reviewed by: {fee.reviewedBy || 'System'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Summary */}
          {fees.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-700 font-light">
                Showing {fees.length} fee record{fees.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Total Amount: {formatAmount(fees.reduce((sum, fee) => sum + (fee.feeAmount || 0), 0))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminFees;