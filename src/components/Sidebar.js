import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-20 h-full bg-blue-800 text-white flex flex-col z-50">
      <div className="flex-1 p-2 space-y-8 mt-16">
        <Link to="/hod" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaHome className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/studentenrollment" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaUserGraduate className="w-6 h-6 mb-1" />
          <span className="text-xs">Student Enrollment</span>
        </Link>
        <Link to="/qasettings" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaUser className="w-6 h-6 mb-1" />
          <span className="text-xs">QA Settings</span>
        </Link>
        <Link to="/scrutinizer" className="flex flex-col items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaUserGraduate className="w-6 h-6 mb-1" />
          <span className="text-xs">Scrutinizer</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
