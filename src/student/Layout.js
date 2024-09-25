// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';  // Adjust the path if needed
import TopNavbar from './TopNavbar';  // Adjust the path if needed

const StudentLayout = ({ children }) => {
  return (
    <div className="flex">
      <TopNavbar />
      
      <div className="flex-1 flex flex-col">
        <Sidebar />
        <div className="p-3 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;