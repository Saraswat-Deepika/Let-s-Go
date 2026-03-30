import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlacesPage from './pages/PlacesPage';
import SearchPage from './pages/SearchPage';
import PlaceDetails from './pages/PlaceDetails';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dashboard layout wrapper for sub-pages
const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout" style={{ display: 'flex', background: '#f6f7fb', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ marginTop: '64px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                <Route path="search" element={<DashboardLayout><SearchPage /></DashboardLayout>} />
                <Route path="temples" element={<DashboardLayout><PlacesPage category="temples" /></DashboardLayout>} />
                <Route path="cafes" element={<DashboardLayout><PlacesPage category="cafes" /></DashboardLayout>} />
                <Route path="ghats" element={<DashboardLayout><PlacesPage category="ghats" /></DashboardLayout>} />
                <Route path="markets" element={<DashboardLayout><PlacesPage category="markets" /></DashboardLayout>} />
                <Route path="nearby" element={<DashboardLayout><PlacesPage category="nearby" /></DashboardLayout>} />
                <Route path="events" element={<DashboardLayout><PlacesPage category="events" /></DashboardLayout>} />
                <Route path="hotels" element={<DashboardLayout><PlacesPage category="hotels" /></DashboardLayout>} />
                <Route path="transport" element={<DashboardLayout><PlacesPage category="transport" /></DashboardLayout>} />
                <Route path="colleges" element={<DashboardLayout><PlacesPage category="colleges" /></DashboardLayout>} />
                <Route path="emergency" element={<DashboardLayout><PlacesPage category="emergency" /></DashboardLayout>} />
                <Route path="reviews" element={<DashboardLayout><PlacesPage category="reviews" /></DashboardLayout>} />
                <Route path="analytics" element={<DashboardLayout><PlacesPage category="analytics" /></DashboardLayout>} />
                <Route path="place/:id" element={<DashboardLayout><PlaceDetails /></DashboardLayout>} />
              </Routes>
            </ProtectedRoute>
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;