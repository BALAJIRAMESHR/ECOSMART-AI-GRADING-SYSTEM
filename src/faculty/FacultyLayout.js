// src/components/FacultyLayout.js
import React from 'react';
import Sidebar from '../common/SideBar/facsidebar'; // Adjust path as necessary
// import TopNavbar from '../common/TopNavbar'; // Adjust path as necessary

const FacultyLayout = ({ children }) => {
  return (
    <div className="flex max-h-screen overflow-scroll">
      <Sidebar />
      
          {children}
        </div>
  

  );
};

export default FacultyLayout;