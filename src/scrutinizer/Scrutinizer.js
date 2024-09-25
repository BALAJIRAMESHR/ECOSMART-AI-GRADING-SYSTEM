// src/pages/FacultyPage.js
import React from 'react';

// Adjust path as necessary


const Dashboard = () => {
  const userEmail = "user@example.com"; // Replace with actual user email or state

  return (
    <div className="flex">
      
        <div className="p-24 flex-grow">
          <h1 className="text-xl font-bold">Scrutinizer</h1>
          <p className="text-lg mt-4">Welcome, {userEmail}</p>

        </div>
      </div>
  );
};

export default Dashboard;