import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F3E8DF] font-sans selection:bg-[#7C5236] selection:text-white">
      {/* Top Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center bg-transparent max-w-7xl mx-auto">
        <Link to="/" className="text-3xl font-bold tracking-tighter text-[#2a2420]">
          SwiftZip
        </Link>
        <div className="space-x-6">
          <Link 
            to="/" 
            className={`font-semibold transition-colors ${location.pathname === '/' ? 'text-[#7C5236]' : 'text-gray-500 hover:text-[#2a2420]'}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`font-semibold transition-colors ${location.pathname === '/dashboard' ? 'text-[#7C5236]' : 'text-gray-500 hover:text-[#2a2420]'}`}
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
