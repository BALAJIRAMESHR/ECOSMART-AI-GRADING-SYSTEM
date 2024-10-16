// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-[16em] min-h-screen bg-blue-800 text-white flex flex-col z-50">
      <div className="flex-1 p-6 space-y-8 mt-16">
        <Link to="/faculty" className="flex gap-3 items-center py-2 px-4 hover:border-l-2">
          <FaHome className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Home</span>
        </Link>
        <Link to="/qapaper" className="flex gap-3 items-center py-2 px-4 hover:border-l-2">
          <FaUser className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">QA Settings</span>
        </Link>
        <Link to="/qascrutinizer" className="flex gap-3 items-center py-2 px-4 hover:border-l-2">
          <FaUserGraduate className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Scrutinizer</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
