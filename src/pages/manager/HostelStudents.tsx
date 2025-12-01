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

  const handleKick = async (bookingId: string, reason: 'LEFT_HOSTEL' | 'VIOLATED_RULES') => {
    if (!confirm(`Are you sure you want to kick this student? Reason: ${reason}`)) {
      return;
    }

    setKicking(bookingId);
    try {
      await bookingsApi.kick(bookingId, { reason });
      loadStudents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to kick student');
    } finally {
      setKicking(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Current Students</h1>

      {students.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No students currently in this hostel.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((item) => (
                <tr key={item.bookingId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium">{item.student.user.email}</p>
                    <p className="text-sm text-gray-500">{item.student.fatherName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm">{item.student.phoneNumber}</p>
                    <p className="text-sm text-gray-500">{item.student.whatsappNumber}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleKick(item.bookingId, 'LEFT_HOSTEL')}
                        disabled={kicking === item.bookingId}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-sm disabled:opacity-50"
                      >
                        Left Hostel
                      </button>
                      <button
                        onClick={() => handleKick(item.bookingId, 'VIOLATED_RULES')}
                        disabled={kicking === item.bookingId}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm disabled:opacity-50"
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
      )}
    </div>
  );
};

export default HostelStudents;