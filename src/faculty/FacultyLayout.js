// src/components/FacultyLayout.js
import React from 'react';
import Sidebar from '../components/facsidebar'; // Adjust path as necessary
import TopNavbar from '../components/TopNavbar'; // Adjust path as necessary

const FacultyLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      
        
          {children}
        </div>
  

  );
};

export default FacultyLayout;