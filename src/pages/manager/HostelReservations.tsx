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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleReview = async (
    id: string,
    status: 'ACCEPTED' | 'REJECTED',
    reason?: string
  ) => {
    setProcessing(id);
    try {
      await reservationsApi.review(id, { status, rejectReason: reason });
      await loadReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to review');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading reservations...
        </p>
      </main>
    );
  }

  const pendingReservations = reservations.filter(
    (r) => r.status === 'PENDING'
  );
  const otherReservations = reservations.filter(
    (r) => r.status !== 'PENDING'
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Reservations
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Hostel Reservations
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Review reservation requests and manage their status.
          </p>
        </header>

        {/* Pending Reservations */}
        <section className="border border-gray-100 bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-gray-900">
              Pending Reservations
            </h2>
            <span className="text-xs text-gray-500 font-light">
              {pendingReservations.length} pending
            </span>
          </div>

          {pendingReservations.length === 0 ? (
            <p className="text-sm text-gray-500 font-light">
              No pending reservations.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingReservations.map((reservation) => (
                <article
                  key={reservation.id}
                  className="border border-gray-100 bg-gray-50 px-4 py-4 text-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-light text-gray-900 mb-1">
                        {reservation.student.user.email}
                      </p>
                      <p className="text-xs text-gray-600 font-light">
                        Phone: {reservation.student.phoneNumber}
                      </p>
                      {reservation.message && (
                        <p className="text-xs text-gray-600 font-light mt-2">
                          Message: {reservation.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 font-light mt-1">
                        Submitted: {formatDate(reservation.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleReview(reservation.id, 'ACCEPTED')
                        }
                        disabled={processing === reservation.id}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-light hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing === reservation.id &&
                        reservation.status === 'PENDING'
                          ? 'Processing...'
                          : 'Accept'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const reason = window.prompt(
                            'Rejection reason (optional):'
                          );
                          handleReview(
                            reservation.id,
                            'REJECTED',
                            reason || undefined
                          );
                        }}
                        disabled={processing === reservation.id}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-light hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Reservation History */}
        <section className="border border-gray-100 bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-gray-900">
              Reservation History
            </h2>
            <span className="text-xs text-gray-500 font-light">
              {otherReservations.length} records
            </span>
          </div>

          {otherReservations.length === 0 ? (
            <p className="text-sm text-gray-500 font-light">
              No reservation history.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {otherReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-4 py-3 text-xs text-gray-900 font-light whitespace-nowrap">
                        {reservation.student.user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-[11px] font-light border ${getStatusClasses(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-light whitespace-nowrap">
                        {formatDate(reservation.createdAt)}
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

export default HostelReservations;