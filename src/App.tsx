import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Hostel Pages
import HostelList from './pages/hostels/HostelList';
import HostelDetail from './pages/hostels/HostelDetail';
import BookHostel from './pages/hostels/BookHostel';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SelfVerify from './pages/student/SelfVerify';
import LeaveHostel from './pages/student/LeaveHostel';
import CreateReport from './pages/student/CreateReport';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import SubmitVerification from './pages/manager/SubmitVerification';
import CreateHostel from './pages/manager/CreateHostel';
import HostelStudents from './pages/manager/HostelStudents';
import HostelBookings from './pages/manager/HostelBookings';
import HostelReservations from './pages/manager/HostelReservations';
import SubmitFee from './pages/manager/SubmitFee';
import ManagerFees from './pages/manager/ManagerFees';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminReports from './pages/admin/AdminReports';
import AdminFees from './pages/admin/AdminFees';
import AdminUsers from './pages/admin/AdminUsers';

// Chat Page
import Chat from './pages/chat/Chat';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect based on role
  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return '/';
    switch (user.role) {
      case 'ADMIN':
      case 'SUBADMIN':
        return '/admin';
      case 'MANAGER':
        return '/manager';
      case 'STUDENT':
        return '/student';
      default:
        return '/';
    }
  };

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={getDefaultRoute()} /> : <Register />}
        />

        {/* Hostel Public Routes */}
        <Route path="/hostels" element={<HostelList />} />
        <Route path="/hostels/:id" element={<HostelDetail />} />

        {/* Protected Hostel Booking */}
        <Route
          path="/hostels/:id/book"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <BookHostel />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/verify"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <SelfVerify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/leave"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <LeaveHostel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/report/:bookingId"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <CreateReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/chat"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/verification"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <SubmitVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/hostels/create"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <CreateHostel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/hostels/:hostelId/students"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <HostelStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/hostels/:hostelId/bookings"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <HostelBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/hostels/:hostelId/reservations"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <HostelReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/fees/submit"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <SubmitFee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/fees"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerFees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/chat"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/reports"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerReports />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUBADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verifications"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUBADMIN']}>
              <AdminVerifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUBADMIN']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUBADMIN']}>
              <AdminFees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUBADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

// Manager Reports Component (simple view)
const ManagerReports: React.FC = () => {
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadReports = async () => {
      try {
        const { reportsApi } = await import('./lib/api');
        const response = await reportsApi.getManagerReports();
        setReports(response.data.data);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports Against Me</h1>
      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No reports filed against your hostels.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Report from: {report.student?.user?.email}</p>
                  <p className="text-sm text-gray-600">Hostel: {report.booking?.hostel?.hostelName}</p>
                  <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                  {report.finalResolution && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium">Resolution: {report.finalResolution}</p>
                      <p className="text-xs text-gray-500">Decision: {report.decision}</p>
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 h-fit rounded-full text-sm ${
                    report.status === 'OPEN'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;