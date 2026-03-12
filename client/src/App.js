import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import './animations.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Browse from './pages/Browse';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Pricing from './pages/Pricing';

import PrivateRoute from './components/auth/PrivateRoute';
import LiveChatWidget from './components/features/LiveChatWidget';

const authRoutes = ['/login', '/register'];

function AppLayout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/project/:id" element={<ProjectDetails />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route path="/profile/:id" element={<Profile />} />

          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <LiveChatWidget />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;