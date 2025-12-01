import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../lib/api';

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('OPEN');

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await reportsApi.getAll(filter || undefined);
      setReports(response.data.data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    const decision = prompt('Decision (STUDENT_FAULT, MANAGER_FAULT, NONE):');
    if (!decision || !['STUDENT_FAULT', 'MANAGER_FAULT', 'NONE'].includes(decision)) {
      alert('Invalid decision');
      return;
    }

    const resolution = prompt('Final resolution message:');
    if (!resolution) return;

    setProcessing(id);
    try {
      await reportsApi.resolve(id, { decision, finalResolution: resolution });
      loadReports();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to resolve');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No reports found.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Report #{report.id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    Student: {report.student?.user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Manager: {report.manager?.user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Hostel: {report.booking?.hostel?.hostelName}
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm">{report.description}</p>
                  </div>
                  {report.finalResolution && (
                    <div className="mt-2 p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium">Resolution:</p>
                      <p className="text-sm">{report.finalResolution}</p>
                      <p className="text-xs text-gray-500 mt-1">Decision: {report.decision}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      report.status === 'OPEN'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.status === 'OPEN' && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleResolve(report.id)}
                        disabled={processing === report.id}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    </div>
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

export default AdminReports;