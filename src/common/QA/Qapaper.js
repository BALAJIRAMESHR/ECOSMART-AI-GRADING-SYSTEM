import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';

const QAPaper = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examname, setExamname] = useState('');
  const [totalMarks, setTotalMarks] = useState(null);
  const [questionData, setQuestionData] = useState({ question: '', prompt: '', answer: '', marks: 0 });
  const [questionList, setQuestionList] = useState([]);
  const [facultyEmail] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [fid, setFid] = useState('');
  const [currentMarks, setCurrentMarks] = useState(0);
  
  useEffect(() => {
    const fetchFacultyId = async () => {
      const id = Cookies.get('cookie_user_id')
      const { data, error } = await supabase.from('LOGIN').select('email').eq('user_id', id).single();
      if (error) {
        console.error('Error fetching faculty email:', error);
        toast.error('Error fetching faculty email. Please try again.');
        return;
      }
      let email = data.email
      if (email) {
        const { data, error } = await supabase.from('FACULTY').select('fid').eq('email', email).single();

        if (error) {
          console.error('Error fetching faculty ID:', error);
          toast.error('Error fetching faculty ID. Please check the email address.');
          return;
        }

        if (data) {
          setFid(data.fid);
        } else {
          toast.error('Faculty email not found.');
        }
      }
    };
    
    const getCourses = async () => {
      try {
        const id = Cookies.get('cookie_user_id');
        const { data: loginData, error: loginError } = await supabase
          .from('LOGIN')
          .select('email')
          .eq('user_id', id)
          .single();

        if (loginError) throw loginError;

        const { data: facultyData, error: facultyError } = await supabase
          .from('FACULTY')
          .select('handled_courses')
          .eq('email', loginData.email)
          .single();

        if (facultyError) throw facultyError;

        const handledCoursesArray = facultyData.handled_courses;
        
        if (handledCoursesArray && handledCoursesArray.length > 0) {
          const { data: courseData, error: courseError } = await supabase
            .from('COURSE')
            .select('course_code, course_name')
            .in('course_code', handledCoursesArray);

          if (courseError) throw courseError;

          setCourses(courseData || []);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses. Please try again.');
      }
    };

    getCourses();
    fetchFacultyId();
  }, [facultyEmail]);

  const handleAddQuestion = () => {
    if (!questionData.question || !questionData.prompt || !questionData.answer || !questionData.marks) {
      toast.error('Fill all fields!');
      return;
    }

    if (currentMarks + parseInt(questionData.marks) > totalMarks) {
      toast.warning('Total marks exceeded!');
      return;
    }

    setQuestionList([...questionList, { ...questionData }]);
    setCurrentMarks(currentMarks + parseInt(questionData.marks));
    setQuestionData({ question: '', prompt: '', answer: '', marks: 0 });
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course!");
      return;
    }

    if (!examname) {
      toast.error("Please select an exam name!");
      return;
    }

    if (!academicYear) {
      toast.error("Please select an academic year!");
      return;
    }

    if (totalMarks !== currentMarks) {
      toast.error("Total marks do not match current marks!");
      return;
    }

    try {
      // Generate a random question paper ID
      const questionPaperId = Math.floor(Math.random() * (10000000 - 9999 + 1) + 9999);

      // Create the question paper entry
      const questionEntries = {
        faculty_id: fid,
        exam_name: examname,
        academic: academicYear,
        question_paper_id: questionPaperId,
        course_id: selectedCourse, // Using the selected course directly
        qap: questionList.map((q, index) => ({
          qid: index + 1,
          question: q.question,
          prompt: q.prompt,
          answer: q.answer,
          marks: parseInt(q.marks)
        }))
      };

      console.log('Submitting question paper:', questionEntries);

      const { error } = await supabase
        .from('QATABLE')
        .insert([questionEntries]);

      if (error) {
        console.error('Submission error:', error);
        toast.error(`Error submitting questions: ${error.message}`);
        return;
      }

      toast.success('Questions submitted successfully!');
      
      // Reset form
      setQuestionList([]);
      setTotalMarks(0);
      setCurrentMarks(0);
      setSelectedCourse('');
      setExamname('');
      setAcademicYear('');
      
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className='w-full py-5 px-10 max-h-screen overflow-scroll flex gap-6'>
      <div className="min-w-[65%]">
        <ToastContainer position="top-right" autoClose={5000} theme="light"/>
        <h2 className="text-xl font-bold mb-4">Question Paper Settings</h2>
      
        <div className='w-full flex flex-col'>
          <div className="flex flex-wrap items-center gap-2 mb-4 w-full">
            <div className="flex-1 w-1/4 min-w-fit">
              <label className="block mb-2">Exam Name:</label>
              <select
                value={examname}
                onChange={(e) => setExamname(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select exam name</option>
                <option value="CAT 1">CAT 1</option>
                <option value="CAT 2">CAT 2</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>

            <div className="flex-1 w-1/4 min-w-fit">
              <label className="block mb-2">Academic Year:</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select academic year</option>
                <option value="2021-2022">2021-2022</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>

            <div className="flex-1 w-1/4 min-w-fit">
              <label className="block mb-2">Total Marks:</label>
              <input
                type="number"
                value={totalMarks || ''}
                onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                className="p-2 border rounded w-full"
                placeholder="Enter total marks"
              />
            </div>

            <div className="flex-1 w-1/4 min-w-fit max-w-[17em]">
              <label className="block mb-2">Select Course:</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_code} value={course.course_code}>
                    {String(course.course_code).padStart(4, '0')} - {course.course_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className='w-full flex justify-end mt-6'>
            {totalMarks === currentMarks && totalMarks > 0 && (
              <button 
                onClick={handleSubmit} 
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Submit Questions
              </button>
            )}
          </div>
        </div>

        {totalMarks > currentMarks && (
          <QuestionForm 
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleAddQuestion={handleAddQuestion}
            totalMarks={totalMarks}
            currentMarks={currentMarks}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <QuestionList questionList={questionList} />
    </div>
  );
};

export default QAPaper;