// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserGraduate, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="min-w-[14em] min-h-screen bg-blue-800 text-white flex flex-col items-start justify-end z-50">
      <div className="flex-1 p-6 space-y-3 mt-16">
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
      <div className='p-6'>
        <Link to="/" className="flex gap-3 items-center py-2 px-4 hover:border-l-2">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M202.87-111.87q-37.78 0-64.39-26.61t-26.61-64.39v-554.26q0-37.78 26.61-64.39t64.39-26.61h279.04v91H202.87v554.26h279.04v91H202.87Zm434.02-156.65L574-333.93 674.56-434.5H358.09v-91h316.47L574-626.07l62.89-65.41L848.13-480 636.89-268.52Z"/></svg>
          <span className="text-md font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;