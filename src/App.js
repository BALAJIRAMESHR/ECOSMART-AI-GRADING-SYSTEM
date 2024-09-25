import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StudentPage from './student/StudentPage';
import FacultyPage from './faculty/FacultyPage';
import LoginPage from './authentication/LoginPage';
import HODPage from './hod/HODPage';
import StudentEnrollment from './faculty/Student Enrollment'; 
import Qasettings from './common/Qasettings';
import Scrutinizer from './scrutinizer/Scrutinizer';
import Layout from './common/Layout'; 
import FacultyLayout from './faculty/FacultyLayout'; 
import Qapaper from './common/Qapaper';
import QaScrutinizer from './common/Qpscrutinizer';
import Profile from './common/Profile';
import ForgotPasswordPage from './authentication/forgot';
import HodCourseMapping from './hod/HodCourseMapping';


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
 