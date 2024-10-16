// src/components/Layout.js
import React from 'react';
import TopNavbar from '../common/TopNavbar';
import StuSidebar from '../common/StuSideBar';

const StudentLayout = ({ children }) => {
  return (
    <div className="flex w-full">
      {/* SideBar */}
      <StuSidebar/>
      <div className='flex flex-col w-full'>
        <TopNavbar />
        
        <div className="">
          <div className="">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;