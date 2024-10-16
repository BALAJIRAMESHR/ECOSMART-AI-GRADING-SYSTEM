import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="min-w-[16em] px-2 min-h-screen bg-blue-800 text-white flex flex-col z-50">
      <div className="flex flex-col p-2 space-y-8 mt-16">
        <Link to="/hod" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaHome className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Home</span>
        </Link>
        <Link to="/coursemapping" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaUserGraduate className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Course Mapping</span>
        </Link>
        <Link to="/studentenrollment" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaUserGraduate className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Student Enrollment</span>
        </Link>
        <Link to="/qasettings" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaUser className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">QA Settings</span>
        </Link>
        <Link to="/scrutinizer" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaUserGraduate className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Scrutinizer</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
