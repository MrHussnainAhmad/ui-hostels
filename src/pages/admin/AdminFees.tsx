import React, { useEffect, useState } from 'react';
import { feesApi } from '../../lib/api';

const AdminFees: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    loadFees();
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

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`${status} this fee payment?`)) return;

    setProcessing(id);
    try {
      await feesApi.review(id, { status });
      loadFees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Monthly Admin Fees</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {fees.length === 0 ? (
            <p className="p-6 text-gray-500">No fees found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fees.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{fee.manager?.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{fee.hostel?.hostelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{fee.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{fee.studentCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Rs. {fee.feeAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fee.paymentProofImage && (
                        <a
                          href={fee.paymentProofImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          View
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          fee.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : fee.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fee.status === 'PENDING' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleReview(fee.id, 'APPROVED')}
                            disabled={processing === fee.id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(fee.id, 'REJECTED')}
                            disabled={processing === fee.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFees;