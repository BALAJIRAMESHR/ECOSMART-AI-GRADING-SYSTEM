// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-20 h-screen bg-blue-800 text-white flex flex-col z-50">
      <div className="flex-1 p-6 space-y-8 mt-16">
        <Link to="/faculty" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaHome className="w-6 h-10 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/qapaper" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaUser className="w-6 h-6 mb-1" />
          <span className="text-xs">QA Settings</span>
        </Link>
        <Link to="/qascrutinizer" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaUserGraduate className="w-6 h-6 mb-1" />
          <span className="text-xs">Scrutinizer</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
