import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HrDashboard from './pages/HrDashboard';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

// Loading Spinner Component
const FullScreenLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-300">
    <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-slate-600 dark:text-slate-450 text-sm font-semibold tracking-wider uppercase animate-pulse">
      Loading Enterprise Systems...
    </p>
  </div>
);

// Route Guard for Authenticated Users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Route Guard for HR Administrators
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (user?.role !== 'HR') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Redirect root path to correct home based on session state
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return user?.role === 'HR' ? <Navigate to="/hr" replace /> : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern notifications toast configuration */}
      <Toaster
        position="top-right"
        containerStyle={{
          top: '80px',
        }}
        toastOptions={{
          duration: 3500,
          style: {
            background: theme === 'dark' ? '#1e293b' : '#ffffff',
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: theme === 'dark' ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
      {/* Dynamic Header */}
      {isAuthenticated && <Navbar />}

      {/* Main Pages */}
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr"
            element={
              <AdminRoute>
                <HrDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
