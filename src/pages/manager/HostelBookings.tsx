import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingsApi, createFormData } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';

const HostelBookings: React.FC = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [refundData, setRefundData] = useState({
    refundDate: '',
    refundTime: '',
  });
  const [refundImageFiles, setRefundImageFiles] = useState<File[]>([]);
  const [showRefundModal, setShowRefundModal] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelId]);

  const loadBookings = async () => {
    try {
      const response = await bookingsApi.getHostelBookings(hostelId!);
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    if (!window.confirm('Approve this booking?')) return;
    setProcessing(bookingId);
    try {
      await bookingsApi.approve(bookingId);
      await loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleDisapprove = async (bookingId: string) => {
    if (
      refundImageFiles.length === 0 ||
      !refundData.refundDate ||
      !refundData.refundTime
    ) {
      alert('Please fill all refund details and upload refund screenshot.');
      return;
    }
    setProcessing(bookingId);
    try {
      const formDataToSend = createFormData(refundData, [
        { fieldName: 'refundImage', files: refundImageFiles },
      ]);

      await bookingsApi.disapprove(bookingId, formDataToSend);
      closeRefundModal();
      await loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to disapprove');
    } finally {
      setProcessing(null);
    }
  };

  const closeRefundModal = () => {
    setShowRefundModal(null);
    setRefundData({ refundDate: '', refundTime: '' });
    setRefundImageFiles([]);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading bookings...
        </p>
      </main>
    );
  }

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const otherBookings = bookings.filter((b) => b.status !== 'PENDING');

  const formatAmount = (amount: number) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'REFUNDED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LEFT':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Bookings
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Hostel Bookings
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Review and manage booking requests for this hostel.
          </p>
        </header>

        {/* Refund Modal */}
        {showRefundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
            <div className="w-full max-w-md border border-gray-200 bg-white px-6 py-6">
              <h3 className="text-lg font-light text-gray-900 mb-3">
                Refund Details
              </h3>
              <p className="text-xs text-gray-500 font-light mb-4">
                Upload the refund proof and provide the refund date and time.
              </p>
              <div className="space-y-4">
                <ImageUpload
                  label="Refund Screenshot"
                  value={refundImageFiles}
                  onChange={setRefundImageFiles}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      Refund Date
                    </label>
                    <input
                      type="date"
                      value={refundData.refundDate}
                      onChange={(e) =>
                        setRefundData({
                          ...refundData,
                          refundDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      Refund Time
                    </label>
                    <input
                      type="time"
                      value={refundData.refundTime}
                      onChange={(e) =>
                        setRefundData({
                          ...refundData,
                          refundTime: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeRefundModal}
                    className="w-full sm:w-1/2 py-2.5 border border-gray-200 text-sm font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDisapprove(showRefundModal)}
                    disabled={processing === showRefundModal}
                    className="w-full sm:w-1/2 py-2.5 bg-red-600 text-white text-sm font-light hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing === showRefundModal
                      ? 'Processing...'
                      : 'Confirm Refund'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Bookings */}
        <section className="border border-gray-100 bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-gray-900">
              Pending Bookings
            </h2>
            <span className="text-xs text-gray-500 font-light">
              {pendingBookings.length} pending
            </span>
          </div>

          {pendingBookings.length === 0 ? (
            <p className="text-sm text-gray-500 font-light">
              No pending bookings.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="border border-gray-100 bg-gray-50 px-4 py-4 text-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-light text-gray-900 mb-1">
                        {booking.student.user.email}
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        Amount: {formatAmount(booking.amount)}
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        From: {booking.fromAccount} → To:{' '}
                        {booking.toAccount}
                      </p>
                      <p className="text-xs text-gray-600 font-light mb-1">
                        Date: {booking.transactionDate} at{' '}
                        {booking.transactionTime}
                      </p>
                      {booking.transactionImage && (
                        <a
                          href={booking.transactionImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-900 font-light underline"
                        >
                          View transaction proof
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(booking.id)}
                        disabled={processing === booking.id}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-light hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === booking.id
                          ? 'Processing...'
                          : 'Approve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRefundModal(booking.id)}
                        disabled={processing === booking.id}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-light hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Disapprove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Booking History */}
        <section className="border border-gray-100 bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-gray-900">
              Booking History
            </h2>
            <span className="text-xs text-gray-500 font-light">
              {otherBookings.length} records
            </span>
          </div>

          {otherBookings.length === 0 ? (
            <p className="text-sm text-gray-500 font-light">
              No booking history.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {['Student', 'Amount', 'Status', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {otherBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3 text-xs text-gray-900 font-light">
                        {booking.student.user.email}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 font-light">
                        {formatAmount(booking.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-[11px] font-light border ${getStatusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-light">
                        {new Date(
                          booking.createdAt
                        ).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
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

export default HostelBookings;