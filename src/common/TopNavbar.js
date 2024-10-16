import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import avatar from '../assets/avatar.png';

const TopNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="w-full px-4 bg-white shadow-md z-40 flex justify-between items-center p-4">
      <div className="flex items-center bg-gray-100 rounded flex-grow max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 bg-transparent focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                Profile
              </Link>
              <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                <AiOutlineLogout className="inline mr-2" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
