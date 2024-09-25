// src/pages/FacultyPage.js
import React from 'react';

// Adjust path as necessary


const StudentDashboard = () => {
  const student = {
    rollno: "123456",
    name: "John Doe",
    department: "Computer Science",
    semester: "5",
    dob: "2000-01-01",
    gender: "Male",
    admissionNumber: "A123456",
    degree: "B.Tech"
  };

  return (
    <div className="flex">
      <div className="p-24 flex-grow">
        <h1 className="text-xl font-bold">Student Profile</h1>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-normal">Roll Number:</div>
            <div>{student.rollno}</div>
            <div className="font-normal">Name:</div>
            <div>{student.name}</div>
            <div className="font-normal">Department:</div>
            <div>{student.department}</div>
            <div className="font-normal">Semester:</div>
            <div>{student.semester}</div>
            <div className="font-normal">Date of Birth:</div>
            <div>{student.dob}</div>
            <div className="font-normal">Gender:</div>
            <div>{student.gender}</div>
            <div className="font-normal">Admission Number:</div>
            <div>{student.admissionNumber}</div>
            <div className="font-normal">Degree:</div>
            <div>{student.degree}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

