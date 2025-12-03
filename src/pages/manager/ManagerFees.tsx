import React, { useEffect, useState } from 'react';
import { feesApi } from '../../lib/api';

const ManagerFees: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFees = async () => {
    try {
      const response = await feesApi.getMy();
      setFees(response.data.data);
    } catch (error) {
      console.error('Error loading fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month: number, year?: number) => {
    // If backend sends just numeric month, show as "Month X"; if year exists, format nicer
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
          Loading fee history...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <header>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Fees
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Fee Payment History
          </h1>
          <p className="text-sm text-gray-500 font-light">
            View all platform fee payments made for your hostels.
          </p>
        </header>

        {/* Table / Empty state */}
        <section className="border border-gray-100 bg-white overflow-hidden">
          {fees.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500 font-light">
                No fee payments have been recorded yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
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
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {fees.map((fee) => (
                    <tr key={fee.id}>
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
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-[11px] font-light border rounded-full ${getStatusClasses(
                            fee.status
                          )}`}
                        >
                          {fee.status}
                        </span>
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

export default ManagerFees;