import React, { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Home, User, GraduationCap, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    Cookies.remove('cookie_user_id');
    // Use navigate instead of window.location for better handling
    navigate('/', { replace: true });
  }, [navigate]);

  // Navigation items configuration
  const navItems = [
    { path: '/faculty', icon: Home, label: 'Home' },
    { path: '/qapaper', icon: User, label: 'QA Settings' },
    { path: '/qascrutinizer', icon: GraduationCap, label: 'Scrutinizer' }
  ];

  // Check if the current path matches the nav item path
  const isActivePath = (path) => location.pathname === path;

  return (
    <div className="min-w-[14em] min-h-screen bg-green-800 text-white flex flex-col">
      {/* Brand Header */}
      <div className="p-4 bg-green-900">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-green-700 p-2 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-center">ECO SMART AI <br/>  GRADING SYSTEM</h1>
        </div>
        <div className="text-center text-sm font-medium pb-2 border-b border-green-700">
         
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-6 space-y-4 mt-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex gap-3 items-center py-2 px-4 rounded-lg transition-all duration-200 group
              ${isActivePath(path) 
                ? 'bg-green-700 shadow-md' 
                : 'hover:bg-green-700/70'}`}
            replace={true} // Use replace instead of push to prevent history stack buildup
          >
            <Icon 
              className={`w-5 h-5 transition-transform duration-200
                ${isActivePath(path) 
                  ? 'scale-110' 
                  : 'group-hover:scale-110'}`}
            />
            <span className="text-md font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-green-700">
        <button 
          onClick={handleLogout}
          className="w-full flex gap-3 items-center py-2 px-4 hover:bg-green-700/70 rounded-lg transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-md font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;