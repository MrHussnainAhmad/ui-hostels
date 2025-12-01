import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reservationsApi } from '../../lib/api';

const HostelReservations: React.FC = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, [hostelId]);

  const loadReservations = async () => {
    try {
      const response = await reservationsApi.getHostelReservations(hostelId!);
      setReservations(response.data.data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'ACCEPTED' | 'REJECTED', reason?: string) => {
    setProcessing(id);
    try {
      await reservationsApi.review(id, { status, rejectReason: reason });
      loadReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const pendingReservations = reservations.filter((r) => r.status === 'PENDING');
  const otherReservations = reservations.filter((r) => r.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hostel Reservations</h1>

      {/* Pending Reservations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Pending Reservations ({pendingReservations.length})</h2>
        {pendingReservations.length === 0 ? (
          <p className="text-gray-500">No pending reservations.</p>
        ) : (
          <div className="space-y-4">
            {pendingReservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{reservation.student.user.email}</p>
                    <p className="text-sm text-gray-600">Phone: {reservation.student.phoneNumber}</p>
                    {reservation.message && (
                      <p className="text-sm text-gray-600 mt-2">
                        Message: {reservation.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(reservation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReview(reservation.id, 'ACCEPTED')}
                      disabled={processing === reservation.id}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Rejection reason (optional):');
                        handleReview(reservation.id, 'REJECTED', reason || undefined);
                      }}
                      disabled={processing === reservation.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Reservation History</h2>
        {otherReservations.length === 0 ? (
          <p className="text-gray-500">No reservation history.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {otherReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{reservation.student.user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reservation.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : reservation.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.createdAt).toLocaleDateString()}
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

export default HostelReservations;