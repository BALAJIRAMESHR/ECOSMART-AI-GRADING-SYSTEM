import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { supabase } from './supabaseClient';
import StudentPage from './pages/StudentPage';
import FacultyPage from './pages/FacultyPage';
import LoginPage from './pages/LoginPage';
import HODPage from './pages/HODPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/hod" element={<HODPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
