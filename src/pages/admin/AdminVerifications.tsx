import React, { useEffect, useState } from 'react';
import { verificationsApi } from '../../lib/api';

const AdminVerifications: React.FC = () => {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    loadVerifications();
  }, [filter]);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const response = await verificationsApi.getAll(filter || undefined);
      setVerifications(response.data.data);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const comment = status === 'REJECTED' ? prompt('Rejection reason:') : undefined;
    if (status === 'REJECTED' && !comment) return;

    setProcessing(id);
    try {
      await verificationsApi.review(id, { status, adminComment: comment });
      loadVerifications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manager Verifications</h1>
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
      ) : verifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No verifications found.
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => (
            <div key={v.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{v.ownerName}</p>
                  <p className="text-sm text-gray-600">{v.manager?.user?.email}</p>
                  <p className="text-sm text-gray-600">
                    {v.city}, {v.address}
                  </p>
                  <p className="text-sm text-gray-600">For: {v.hostelFor}</p>
                  <p className="text-sm text-gray-600">
                    Hostels: {v.initialHostelNames?.join(', ')}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Payment Methods:</p>
                    {v.easypaisaNumber && <p className="text-xs">Easypaisa: {v.easypaisaNumber}</p>}
                    {v.jazzcashNumber && <p className="text-xs">JazzCash: {v.jazzcashNumber}</p>}
                    {v.customBanks?.map((bank: any, i: number) => (
                      <p key={i} className="text-xs">
                        {bank.bankName}: {bank.accountNumber}
                      </p>
                    ))}
                  </div>
                  {v.buildingImages?.length > 0 && (
                    <div className="mt-2 flex space-x-2">
                      {v.buildingImages.map((img: string, i: number) => (
                        <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                          <img src={img} alt={`Building ${i + 1}`} className="w-20 h-20 object-cover rounded" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      v.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : v.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {v.status}
                  </span>
                  {v.status === 'PENDING' && (
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => handleReview(v.id, 'APPROVED')}
                        disabled={processing === v.id}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(v.id, 'REJECTED')}
                        disabled={processing === v.id}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {v.adminComment && (
                    <p className="mt-2 text-sm text-gray-500">Comment: {v.adminComment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;