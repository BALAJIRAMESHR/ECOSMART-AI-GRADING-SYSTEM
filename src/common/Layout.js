// src/components/Layout.js
import React from 'react';
import Sidebar from './HODSidebar';  // Adjust the path if needed
import TopNavbar from './TopNavbar';  // Adjust the path if needed

const Layout = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen max-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full max-h-screen overflow-scroll">
        <TopNavbar />
        <div className="p-3 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
