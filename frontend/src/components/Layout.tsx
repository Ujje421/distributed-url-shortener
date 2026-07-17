import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#0070F3] selection:text-white">
      {/* Top Navigation */}
      <nav className="w-full px-8 py-4 flex justify-between items-center bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center rounded-[4px]">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-black">
              SwiftZip
            </span>
          </Link>
          <div className="space-x-8 text-sm">
            <Link 
              to="/" 
              className={`transition-colors ${location.pathname === '/' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
            >
              Overview
            </Link>
            <Link 
              to="/dashboard" 
              className={`transition-colors ${location.pathname === '/dashboard' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
            >
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
