import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './components/auth/AuthProvider';
import { useAuthStore } from './store/authStore';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import AboutUs from './components/sections/AboutUs';
import FAQ from './components/sections/FAQ';
import HowItWorks from './components/sections/HowItWorks';
import Testimonials from './components/sections/Testimonials';
import Pricing from './components/sections/Pricing';
import Footer from './components/layout/Footer';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoader from './components/admin/AdminLoader';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { user, isAdmin, loading } = useAuthStore();
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean | null>(null);

  // Check admin login flag
  useEffect(() => {
    const flag = localStorage.getItem('adminLoggedIn') === 'true';
    setAdminLoggedIn(flag);
  }, []);

  if (loading || adminLoggedIn === null) {
    return <AdminLoader />;
  }

  return (
    <Router>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <Routes>

            {/* Public Landing Page */}
            <Route path="/landing" element={
              <div className="min-h-screen bg-gradient-to-b from-background-dark to-slate-900 text-white overflow-hidden">
                <Header />
                <main>
                  <Hero />
                  <Features />
                  <AboutUs />
                  <HowItWorks />
                  <FAQ />
                  <Testimonials />
                  <Pricing />
                </main>
                <Footer />
              </div>
            } />

            {/* User Auth Routes */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUpForm />} />

            {/* Admin Login Route */}
            <Route path="/nikunj" element={<AdminLogin />} />

            {/* Admin Protected Route */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* User Protected Route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            {/* Root Redirect */}
            <Route path="/" element={
              adminLoggedIn ? (
                <Navigate to="/admin/dashboard" replace />
              ) : user ? (
                isAdmin ? <Navigate to="/admin/dashboard" replace /> :
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/landing" replace />
              )
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MotionConfig>
      </AuthProvider>
    </Router>
  );
}

export default App;
