import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hostelsApi, bookingsApi } from '../../lib/api';

const HostelStudents: React.FC = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kicking, setKicking] = useState<string | null>(null);
  const [hostelName, setHostelName] = useState('');

  useEffect(() => {
    loadHostelAndStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelId]);

  const loadHostelAndStudents = async () => {
    try {
      // Load hostel details
      const hostelResponse = await hostelsApi.getById(hostelId!);
      setHostelName(hostelResponse.data.data.hostelName);

      // Load students
      const studentsResponse = await hostelsApi.getStudents(hostelId!);
      setStudents(studentsResponse.data.data);
    } catch (error) {
      console.error('Error loading hostel students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKick = async (
    bookingId: string,
    reason: 'LEFT_HOSTEL' | 'VIOLATED_RULES'
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this student as "${reason.replace(
          '_',
          ' '
        )}"?`
      )
    ) {
      return;
    }

    setKicking(bookingId);
    try {
      await bookingsApi.kick(bookingId, { reason });
      await loadHostelAndStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update student status');
    } finally {
      setKicking(null);
    }
  };

  const formatBookingType = (type: string) => {
    switch (type) {
      case 'URGENT':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded-full">Urgent</span>;
      case 'REGULAR':
        return <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">Regular</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-full">{type}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading students...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <header>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Students
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Current Students - {hostelName}
          </h1>
          <p className="text-sm text-gray-500 font-light">
            View and manage students currently staying in this hostel.
          </p>
        </header>

        {/* Content */}
        {students.length === 0 ? (
          <section className="border border-gray-100 bg-white px-6 py-8 text-center">
            <p className="text-sm text-gray-500 font-light">
              No students are currently assigned to this hostel.
            </p>
          </section>
        ) : (
          <section className="border border-gray-100 bg-white overflow-hidden rounded-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-sm font-light text-gray-900">
                Active Students
              </h2>
              <span className="text-xs text-gray-500 font-light">
                {students.length} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urgent Leave Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {students.map((item) => (
                    <tr key={item.bookingId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.student?.fullName || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.student?.user?.email || '-'}
                          </p>
                          <p className="text-xs text-gray-500 font-light">
                            {item.student?.fatherName || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">
                            {item.student?.phoneNumber || '-'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.student?.whatsappNumber || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.roomType === 'PRIVATE' 
                            ? 'bg-purple-50 text-purple-700'
                            : item.roomType === 'SHARED'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.roomType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatBookingType(item.bookingType || 'REGULAR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.urgentLeaveDate ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-orange-600 font-medium">
                              {formatDate(item.urgentLeaveDate)}
                            </span>
                            <span className="text-xs text-orange-500">
                              Must leave on this date
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(item.joinedAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleKick(item.bookingId, 'LEFT_HOSTEL')
                            }
                            disabled={kicking === item.bookingId}
                            className="px-3 py-1.5 border border-yellow-300 bg-yellow-50 text-xs text-yellow-800 font-light rounded hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {kicking === item.bookingId ? 'Processing...' : 'Left Hostel'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleKick(
                                item.bookingId,
                                'VIOLATED_RULES'
                              )
                            }
                            disabled={kicking === item.bookingId}
                            className="px-3 py-1.5 border border-red-300 bg-red-50 text-xs text-red-700 font-light rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {kicking === item.bookingId ? 'Processing...' : 'Violated Rules'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Info Box */}
        <div className="border border-blue-200 bg-blue-50 px-4 py-3 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span><strong>Urgent Bookings:</strong> Students must leave on the specified urgent leave date (1st of next month)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span><strong>Regular Bookings:</strong> Can stay until they choose to leave or are removed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span><strong>Admin Fees:</strong> Only regular bookings are counted for admin fee calculation</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default HostelStudents;