import React, { useEffect, useState } from 'react';
import { verificationsApi } from '../../lib/api';

const AdminVerifications: React.FC = () => {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    loadVerifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleReview = async (
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ) => {
    const comment =
      status === 'REJECTED'
        ? window.prompt('Rejection reason:')
        : undefined;
    if (status === 'REJECTED' && !comment) return;

    setProcessing(id);
    try {
      await verificationsApi.review(id, {
        status,
        adminComment: comment,
      });
      await loadVerifications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(null);
    }
  };

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
          Loading verifications...
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
              Admin • Verifications
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              Manager Verifications
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Review manager verification requests and approve or reject
              them.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-light">
              Filter by status
            </span>
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
        </header>

        {/* Content */}
        {verifications.length === 0 ? (
          <section className="border border-gray-100 bg-white px-6 py-8 text-center">
            <p className="text-sm text-gray-500 font-light">
              No verifications found for the selected filter.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {verifications.map((v) => (
              <article
                key={v.id}
                className="border border-gray-100 bg-white px-6 py-5 text-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left: details */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-light text-gray-900">
                        {v.ownerName}
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        {v.manager?.user?.email}
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        {v.city}, {v.address}
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        For:{' '}
                        <span className="font-normal">
                          {v.hostelFor}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        Hostels:{' '}
                        <span className="font-normal">
                          {v.initialHostelNames?.join(', ') || '-'}
                        </span>
                      </p>
                    </div>

                    {/* Payment methods */}
                    <div className="mt-1">
                      <p className="text-xs text-gray-600 font-light mb-1">
                        Payment Methods:
                      </p>
                      {v.easypaisaNumber && (
                        <p className="text-[11px] text-gray-700 font-light">
                          Easypaisa: {v.easypaisaNumber}
                        </p>
                      )}
                      {v.jazzcashNumber && (
                        <p className="text-[11px] text-gray-700 font-light">
                          JazzCash: {v.jazzcashNumber}
                        </p>
                      )}
                      {v.customBanks?.map(
                        (bank: any, i: number) => (
                          <p
                            key={i}
                            className="text-[11px] text-gray-700 font-light"
                          >
                            {bank.bankName}: {bank.accountNumber}
                            {bank.iban && ` (IBAN: ${bank.iban})`}
                          </p>
                        )
                      )}
                    </div>

                    {/* Images */}
                    {v.buildingImages?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {v.buildingImages.map(
                          (img: string, i: number) => (
                            <a
                              key={i}
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={img}
                                alt={`Building ${i + 1}`}
                                className="w-20 h-20 object-cover border border-gray-200"
                              />
                            </a>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: status & actions */}
                  <div className="text-right space-y-3 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-light border rounded-full ${getStatusClasses(
                        v.status
                      )}`}
                    >
                      {v.status}
                    </span>

                    {v.status === 'PENDING' && (
                      <div className="space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleReview(v.id, 'APPROVED')
                          }
                          disabled={processing === v.id}
                          className="px-4 py-2 bg-green-600 text-white text-xs font-light rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === v.id
                            ? 'Processing...'
                            : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleReview(v.id, 'REJECTED')
                          }
                          disabled={processing === v.id}
                          className="px-4 py-2 bg-red-600 text-white text-xs font-light rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {v.adminComment && (
                      <div className="mt-1 border border-gray-100 bg-gray-50 px-3 py-2">
                        <p className="text-[11px] text-gray-500 font-medium mb-0.5">
                          Admin Comment
                        </p>
                        <p className="text-[11px] text-gray-700 font-light">
                          {v.adminComment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminVerifications;