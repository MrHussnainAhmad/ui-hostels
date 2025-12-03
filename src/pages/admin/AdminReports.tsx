import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../lib/api';

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState('OPEN');

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const decision = window.prompt(
      'Decision (STUDENT_FAULT, MANAGER_FAULT, NONE):'
    );
    if (
      !decision ||
      !['STUDENT_FAULT', 'MANAGER_FAULT', 'NONE'].includes(decision)
    ) {
      alert('Invalid decision');
      return;
    }

    const resolution = window.prompt('Final resolution message:');
    if (!resolution) return;

    setProcessing(id);
    try {
      await reportsApi.resolve(id, {
        decision,
        finalResolution: resolution,
      });
      await loadReports();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to resolve');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusClasses = (status: string) =>
    status === 'OPEN'
      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
      : 'bg-green-50 text-green-700 border-green-200';

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading reports...
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
              Admin • Reports
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              Dispute Reports
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Review and resolve disputes between students and managers.
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
              <option value="OPEN">Open</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </header>

        {/* Content */}
        {reports.length === 0 ? (
          <section className="border border-gray-100 bg-white px-6 py-8 text-center">
            <p className="text-sm text-gray-500 font-light">
              No reports found for the selected filter.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {reports.map((report) => (
              <article
                key={report.id}
                className="border border-gray-100 bg-white px-6 py-5 text-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left: details */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 font-light">
                      Report #{report.id.slice(-6)}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 font-light">
                        Student:{' '}
                        <span className="font-normal">
                          {report.student?.user?.email || '-'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-900 font-light">
                        Manager:{' '}
                        <span className="font-normal">
                          {report.manager?.user?.email || '-'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-900 font-light">
                        Hostel:{' '}
                        <span className="font-normal">
                          {report.booking?.hostel?.hostelName || '-'}
                        </span>
                      </p>
                    </div>

                    <div className="mt-2 border border-gray-100 bg-gray-50 px-3 py-3">
                      <p className="text-xs font-medium text-gray-800 mb-1">
                        Description
                      </p>
                      <p className="text-xs text-gray-700 font-light whitespace-pre-wrap">
                        {report.description}
                      </p>
                    </div>

                    {report.finalResolution && (
                      <div className="mt-2 border border-blue-100 bg-blue-50 px-3 py-3">
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          Resolution
                        </p>
                        <p className="text-xs text-blue-800 font-light whitespace-pre-wrap">
                          {report.finalResolution}
                        </p>
                        <p className="text-[11px] text-gray-500 font-light mt-1">
                          Decision: {report.decision}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: status & actions */}
                  <div className="text-right space-y-3 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-light border rounded-full ${getStatusClasses(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>

                    {report.status === 'OPEN' && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleResolve(report.id)}
                          disabled={processing === report.id}
                          className="px-4 py-2 bg-gray-900 text-white text-xs font-light rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === report.id
                            ? 'Resolving...'
                            : 'Resolve'}
                        </button>
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

export default AdminReports;