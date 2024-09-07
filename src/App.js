import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import FacultyPage from './pages/FacultyPage';
import LoginPage from './pages/LoginPage';
import HODPage from './pages/HODPage';
import StudentEnrollment from './components/Student Enrollment'; 
import Qasettings from './components/Qasettings';
import Scrutinizer from './components/Scrutinizer';
import Layout from './components/Layout'; 
import FacultyLayout from './components/FacultyLayout'; 
import Qapaper from './components/Qapaper';
import QaScrutinizer from './components/Qpscrutinizer';
import Profile from './components/Profile';
import ForgotPasswordPage from './components/forgot';
import HodCourseMapping from './pages/HodCourseMapping';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<Layout><StudentPage /></Layout>} />
        <Route path="/faculty" element={<FacultyLayout><FacultyPage /></FacultyLayout>} />
        <Route path="/hod" element={<Layout><HODPage /></Layout>} />
        <Route path="/studentenrollment" element={<Layout><StudentEnrollment /></Layout>} />
        <Route path="/qasettings" element={<Layout><Qasettings /></Layout>} />
        <Route path="/scrutinizer" element={<Layout><Scrutinizer /></Layout>} />
        <Route path="/qapaper" element={<FacultyLayout><Qapaper/></FacultyLayout>} />
        <Route path="/qascrutinizer" element={<FacultyLayout><QaScrutinizer /></FacultyLayout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/coursemapping" element={<Layout><HodCourseMapping  /></Layout>} />
        <Route path="/forgot" element={<ForgotPasswordPage/>} />
        
      
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
 