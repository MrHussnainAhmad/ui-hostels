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
    if (!confirm('Approve this booking?')) return;
    setProcessing(bookingId);
    try {
      await bookingsApi.approve(bookingId);
      loadBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleDisapprove = async (bookingId: string) => {
    if (refundImageFiles.length === 0 || !refundData.refundDate || !refundData.refundTime) {
      alert('Please fill all refund details and upload refund screenshot');
      return;
    }
    setProcessing(bookingId);
    try {
      const formDataToSend = createFormData(refundData, [
        { fieldName: 'refundImage', files: refundImageFiles },
      ]);

      await bookingsApi.disapprove(bookingId, formDataToSend);
      setShowRefundModal(null);
      setRefundData({ refundDate: '', refundTime: '' });
      setRefundImageFiles([]);
      loadBookings();
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
    return <div className="text-center py-10">Loading...</div>;
  }

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const otherBookings = bookings.filter((b) => b.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hostel Bookings</h1>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Refund Details</h3>
            <div className="space-y-4">
              <ImageUpload
                label="Refund Screenshot"
                value={refundImageFiles}
                onChange={setRefundImageFiles}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Refund Date</label>
                  <input
                    type="date"
                    value={refundData.refundDate}
                    onChange={(e) => setRefundData({ ...refundData, refundDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Refund Time</label>
                  <input
                    type="time"
                    value={refundData.refundTime}
                    onChange={(e) => setRefundData({ ...refundData, refundTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={closeRefundModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDisapprove(showRefundModal)}
                  disabled={processing === showRefundModal}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {processing === showRefundModal ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Pending Bookings ({pendingBookings.length})</h2>
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500">No pending bookings.</p>
        ) : (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{booking.student.user.email}</p>
                    <p className="text-sm text-gray-600">Amount: Rs. {booking.amount}</p>
                    <p className="text-sm text-gray-600">
                      From: {booking.fromAccount} → To: {booking.toAccount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {booking.transactionDate} at {booking.transactionTime}
                    </p>
                    {booking.transactionImage && (
                      <a
                        href={booking.transactionImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-sm hover:underline"
                      >
                        View Transaction Proof
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(booking.id)}
                      disabled={processing === booking.id}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setShowRefundModal(booking.id)}
                      disabled={processing === booking.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      Disapprove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Bookings History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Booking History</h2>
        {otherBookings.length === 0 ? (
          <p className="text-gray-500">No booking history.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {otherBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{booking.student.user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">Rs. {booking.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'REFUNDED'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'LEFT'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelBookings;