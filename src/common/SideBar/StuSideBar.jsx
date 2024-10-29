import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';

const StuSidebar = () => {
  return (
    <div className="min-w-[16em] px-2 min-h-screen bg-blue-800 text-white flex flex-col z-50">
      <div className="flex flex-col p-2 space-y-3 mt-16">
        <Link to="/student" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaHome className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Home</span>
        </Link>
        <Link to="/student/assignments" className="flex gap-2 items-center px-4 hover:border-l-2">
          <FaUserGraduate className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Assignment</span>
        </Link>
      </div>
    </div>
  );
};

export default StuSidebar;
