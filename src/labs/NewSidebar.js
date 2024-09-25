// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const { userRole } = useUser();

  const commonLinks = [
    { path: '/profile', label: 'Profile' },
    { path: '/qasettings', label: 'QA Settings' },
  ];

  const studentLinks = [
    { path: '/student', label: 'Dashboard' },
    { path: '/studentenrollment', label: 'Student Enrollment' },
  ];

  const facultyLinks = [
    { path: '/faculty', label: 'Dashboard' },
    { path: '/scrutinizer', label: 'Scrutinizer' },
  ];

  const hodLinks = [
    { path: '/hod', label: 'Dashboard' },
    { path: '/coursemapping', label: 'Course Mapping' },
  ];

  const links = [
    ...commonLinks,
    ...(userRole === 'student' ? studentLinks : []),
    ...(userRole === 'faculty' ? facultyLinks : []),
    ...(userRole === 'hod' ? hodLinks : []),
  ];

  return (
    <div className="sidebar">
      <ul>
        {links.map(link => (
          <li key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;