import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream-100 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center bg-cream-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold font-serif italic text-charcoal-900 tracking-tight">
              SwiftZip
            </span>
          </Link>

          {/* Centered Links */}
          <div className="hidden md:flex space-x-12 text-sm font-semibold uppercase tracking-widest text-charcoal-900/60">
            <Link 
              to="/" 
              className={`transition-colors hover:text-charcoal-900 ${location.pathname === '/' ? 'text-charcoal-900 border-b-2 border-orange-500 pb-1' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors hover:text-charcoal-900 ${location.pathname === '/about' ? 'text-charcoal-900 border-b-2 border-orange-500 pb-1' : ''}`}
            >
              About Us
            </Link>
            <Link 
              to="/features" 
              className={`transition-colors hover:text-charcoal-900 ${location.pathname === '/features' ? 'text-charcoal-900 border-b-2 border-orange-500 pb-1' : ''}`}
            >
              Features
            </Link>
            <Link 
              to="/contacts" 
              className={`transition-colors hover:text-charcoal-900 ${location.pathname === '/contacts' ? 'text-charcoal-900 border-b-2 border-orange-500 pb-1' : ''}`}
            >
              Contacts
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-bold text-charcoal-900 hover:opacity-70 transition-opacity">
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="text-sm font-bold bg-charcoal-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-colors shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-charcoal-900 hover:opacity-70 transition-opacity">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-bold bg-charcoal-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-colors shadow-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Simple Footer matching design */}
      <footer className="w-full bg-cream-100 py-8 border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider space-x-6">
            <Link to="/about" className="hover:text-charcoal-900">About Us</Link>
            <Link to="/privacy" className="hover:text-charcoal-900">Privacy</Link>
            <Link to="/contact" className="hover:text-charcoal-900">Contact Us</Link>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            © 2026 SwiftZip. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
