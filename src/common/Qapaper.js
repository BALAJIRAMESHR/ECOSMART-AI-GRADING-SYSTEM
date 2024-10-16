import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase client

const QAPaper = () => {
  // State variables for form inputs and data
  const [semesterCourses, setSemesterCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examname, setExamname] = useState(''); // Use examname instead of examType
  const [totalMarks, setTotalMarks] = useState(0);
  const [questionData, setQuestionData] = useState({ question: '', prompt: '', answer: '', marks: 0 });
  const [questionList, setQuestionList] = useState([]);
  const [facultyEmail] = useState(''); // Email entered in login page
  const [academicYear, setAcademicYear] = useState(''); // Academic year
  const [fid, setFid] = useState(''); // Faculty ID from email

  // Fetch course IDs and transform them into a usable format
  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('STUDENTENROLL').select('sem');
      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      // Transform data into the desired format
      const transformedCourses = data.reduce((acc, item) => {
        Object.entries(item.sem).forEach(([semNumber, semData]) => {
          if (!acc[semNumber]) {
            acc[semNumber] = { courses: [] };
          }
          acc[semNumber].courses = acc[semNumber].courses.concat(semData.courses);
        });
        return acc;
      }, {});

      setSemesterCourses(transformedCourses);
    };

    fetchCourses();
  }, []);

  // Fetch Faculty ID based on Email
  useEffect(() => {
    const fetchFacultyId = async () => {
      if (facultyEmail) {
        const { data, error } = await supabase
          .from('FACULTYLOGIN')
          .select('fid')
          .eq('email', facultyEmail)
          .single();

        if (error) {
          console.error('Error fetching faculty ID:', error);
          alert('Error fetching faculty ID. Please check the email address.');
          return;
        }

        if (data) {
          setFid(data.fid);
        } else {
          alert('Faculty email not found.');
        }
      }
    };

    fetchFacultyId();
  }, [facultyEmail]);

  // Handle adding a new question
  const handleAddQuestion = () => {
    if (questionData.question && questionData.prompt && questionData.answer && questionData.marks) {
      setQuestionList([...questionList, { ...questionData }]);
      setQuestionData({ question: '', prompt: '', answer: '', marks: 0 }); // Reset after adding
    } else {
      alert('Please fill out all question fields, including marks.');
    }
  };

  // Handle submitting questions to the database
  const handleSubmit = async () => {
    try {
      // Map the question list into the format expected by QATABLE
      const questionEntries = questionList.map((q, index) => ({
        fid: fid, 
        examname: examname, // Use examname as exam name
        acadamicyear: academicYear, // Replace with the actual academic year
        qid: index + 1, // Use a unique identifier for each question
        course_id: selectedCourse, // Selected course ID
        qap: { // Store question details in JSONB format
          question: q.question,
          prompt: q.prompt,
          answer: q.answer,
          marks: q.marks
        }
      }));

      console.log('Submitting to QATABLE:', questionEntries); // Log the data being sent

      // Insert the formatted question data into the QATABLE
      const { error } = await supabase.from('QATABLE').insert(questionEntries);

      if (error) {
        console.error('Error inserting data into QATABLE:', error);
        alert('Error submitting questions to the database.');
      } else {
        alert('Questions submitted successfully!');
        setQuestionList([]); // Clear the list after successful submission
        setTotalMarks(0); // Reset total marks
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="p-24 max-h-screen overflow-scroll">
      <h2 className="text-xl font-bold mb-4">Question Paper Settings</h2>

      {/* Row for Faculty ID, Exam Name, and Academic Year */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/4">
          <label className="block mb-2">Exam Name:</label>
          <input
            type="text"
            value={examname}
            onChange={(e) => setExamname(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter exam name"
          />
        </div>

        {/* Academic Year Input */}
        <div className="w-1/4">
          <label className="block mb-2">Academic Year:</label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter academic year"
          />
        </div>

        {/* Total Marks Input */}
        <div className="w-1/4">
          <label className="block mb-2">Total Marks:</label>
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(parseInt(e.target.value, 10))}
            className="p-2 border rounded w-full"
            placeholder="Enter total marks"
          />
        </div>
      </div>

      {/* Row for Course Selection */}
      <div className="flex justify-between items-center mb-4">
        {/* Course Selection */}
        <div className="w-1/2">
          <label className="block mb-2">Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">Select Course</option>
            {Object.entries(semesterCourses).map(([semNumber, semData]) =>
              semData.courses.map((course, index) => (
                <option key={`${semNumber}-${index}`} value={course}>
                  {course} (Semester {semNumber})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Question Input Fields */}
      <div className="mb-4">
        <label className="block mb-2">Question:</label>
        <input
          type="text"
          value={questionData.question}
          onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
          className="p-2 border rounded w-full"
          placeholder="Enter question"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Prompt:</label>
        <input
          type="text"
          value={questionData.prompt}
          onChange={(e) => setQuestionData({ ...questionData, prompt: e.target.value })}
          className="p-2 border rounded w-full"
          placeholder="Enter prompt"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Answer:</label>
        <input
          type="text"
          value={questionData.answer}
          onChange={(e) => setQuestionData({ ...questionData, answer: e.target.value })}
          className="p-2 border rounded w-full"
          placeholder="Enter answer"
        />
      </div>

      {/* Marks for Each Question */}
      <div className="mb-4">
        <label className="block mb-2">Marks:</label>
        <input
          type="number"
          value={questionData.marks}
          onChange={(e) => setQuestionData({ ...questionData, marks: parseInt(e.target.value, 10) })}
          className="p-2 border rounded w-full"
          placeholder="Enter marks for this question"
        />
      </div>

      {/* Add Question Button */}
      <button
        onClick={handleAddQuestion}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Add Question
      </button>

      {/* List of Questions */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Question List:</h3>
        {questionList.map((q, index) => (
          <div key={index} className="border p-4 mb-2 rounded">
            <div><strong>Question:</strong> {q.question}</div>
            <div><strong>Prompt:</strong> {q.prompt}</div>
            <div><strong>Answer:</strong> {q.answer}</div>
            <div><strong>Marks:</strong> {q.marks}</div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit Questions
      </button>
    </div>
  );
};

export default QAPaper;
