import React, { useEffect, useState } from 'react';
import { feesApi } from '../../lib/api';

const AdminFees: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    loadFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadFees = async () => {
    setLoading(true);
    try {
      const response = await feesApi.getAll(filter || undefined);
      setFees(response.data.data);
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

  const formatMonth = (month: number, year?: number) => {
    if (!month) return '-';
    if (!year) return `Month ${month}`;
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-PK', {
      month: 'short',
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
      default:
        return 'bg-red-50 text-red-700 border-red-200';
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
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-light">
              Filter by status
            </span>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 rounded-lg focus:outline-none focus:border-gray-900 font-light"
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </header>

        {/* Table / Empty state */}
        <section className="border border-gray-100 bg-white overflow-hidden">
          {fees.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500 font-light">
                No fees found for the selected filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Hostel
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Proof
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {fees.map((fee) => (
                    <tr key={fee.id}>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900 font-light">
                        {fee.manager?.user?.email || '-'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900 font-light">
                        {fee.hostel?.hostelName || '-'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-700 font-light">
                        {fee.month && fee.year
                          ? formatMonth(fee.month, fee.year)
                          : fee.month || '-'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-700 font-light">
                        {fee.studentCount}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-900 font-light">
                        {formatAmount(fee.feeAmount)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs">
                        {fee.paymentProofImage ? (
                          <a
                            href={fee.paymentProofImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 hover:underline font-light"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 font-light">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-[11px] font-light border rounded-full ${getStatusClasses(
                            fee.status
                          )}`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs">
                        {fee.status === 'PENDING' ? (
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleReview(fee.id, 'APPROVED')
                              }
                              disabled={processing === fee.id}
                              className="text-green-700 hover:text-green-900 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleReview(fee.id, 'REJECTED')
                              }
                              disabled={processing === fee.id}
                              className="text-red-700 hover:text-red-900 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-light">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminFees;