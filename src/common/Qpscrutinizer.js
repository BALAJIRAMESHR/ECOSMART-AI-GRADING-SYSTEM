// src/pages/FacultyPage.js
import React from 'react';

// Adjust path as necessary


const Dashboard = () => {
  const userEmail = "user@example.com"; // Replace with actual user email or state

  return (
    <div className="flex">
      
        <div className="p-10 flex-grow">
          <h1 className="text-xl font-medium">Scrutinizer</h1>
          <p className="font-medium text-neutral-500 mt-1 text-sm">Welcome, {userEmail}</p>

        </div>
      </div>
  );
};

export default Dashboard;

