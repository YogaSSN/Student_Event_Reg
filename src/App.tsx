/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import FacultyDashboard from './pages/FacultyDashboard';
import ManageEvents from './pages/ManageEvents';
import MyRegistrations from './pages/MyRegistrations';
import EventRegistrations from './pages/EventRegistrations';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route 
                path="/events" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <EventsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-registrations" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyRegistrations />
                  </ProtectedRoute>
                } 
              />

              {/* Faculty Routes */}
              <Route 
                path="/faculty-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <FacultyDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-events" 
                element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <ManageEvents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/event-registrations/:eventId" 
                element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <EventRegistrations />
                  </ProtectedRoute>
                } 
              />

              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

