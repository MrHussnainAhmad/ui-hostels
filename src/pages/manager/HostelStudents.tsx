import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { hostelsApi, bookingsApi } from '../../lib/api';

const HostelStudents: React.FC = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kicking, setKicking] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelId]);

  const loadStudents = async () => {
    try {
      const response = await hostelsApi.getStudents(hostelId!);
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error loading students:', error);
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
      await loadStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update student status');
    } finally {
      setKicking(null);
    }
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
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Header */}
        <header>
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Students
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Current Students
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
          <section className="border border-gray-100 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
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
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {students.map((item) => (
                    <tr key={item.bookingId}>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <p className="text-sm text-gray-900 font-light">
                          {item.student.user.email}
                        </p>
                        <p className="text-xs text-gray-500 font-light">
                          {item.student.fatherName || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <p className="text-sm text-gray-900 font-light">
                          {item.student.phoneNumber || '-'}
                        </p>
                        <p className="text-xs text-gray-500 font-light">
                          {item.student.whatsappNumber || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500 font-light">
                        {new Date(
                          item.joinedAt
                        ).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleKick(item.bookingId, 'LEFT_HOSTEL')
                            }
                            disabled={kicking === item.bookingId}
                            className="px-3 py-1.5 border border-yellow-300 bg-yellow-50 text-[11px] text-yellow-800 font-light rounded hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Left Hostel
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
                            className="px-3 py-1.5 border border-red-300 bg-red-50 text-[11px] text-red-700 font-light rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Violated Rules
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
      </div>
    </main>
  );
};

export default HostelStudents;