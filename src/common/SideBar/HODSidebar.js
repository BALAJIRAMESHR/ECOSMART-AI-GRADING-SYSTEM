import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Sidebar = () => {

  const handleLogout = () => {
    Cookies.remove('id');
    window.location.href = '/';
  }

  return (
    <div className="min-w-[16em] px-2 min-h-screen bg-blue-800 text-white flex flex-col justify-between z-50">
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
        <Link to="/qapaper" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaUser className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">QA Settings</span>
        </Link>
        <Link to="/scrutinizer" className="flex gap-2 items-center py-2 px-4 hover:border-l-2">
          <FaUserGraduate className="w-5 h-5 object-contain" />
          <span className="text-md font-medium">Scrutinizer</span>
        </Link>
      </div>

      <div className='py-6 px-2'>
        <div onClick={handleLogout} className="flex gap-3 cursor-pointer items-center py-2 px-4 hover:border-l-2">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M202.87-111.87q-37.78 0-64.39-26.61t-26.61-64.39v-554.26q0-37.78 26.61-64.39t64.39-26.61h279.04v91H202.87v554.26h279.04v91H202.87Zm434.02-156.65L574-333.93 674.56-434.5H358.09v-91h316.47L574-626.07l62.89-65.41L848.13-480 636.89-268.52Z"/></svg>
          <span className="text-md font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
