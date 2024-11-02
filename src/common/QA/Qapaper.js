import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';

const QAPaper = () => {
  const [Courses, setCourses] = useState(null);
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
        alert('Error fetching faculty email. Please try again.');
        return;
      }
      let email = data.email
      if (email) {
        const { data, error } = await supabase.from('FACULTY').select('fid').eq('email', email).single();

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
    
    const getCourses = async () => {
      const id = Cookies.get('cookie_user_id');
      const { data, error } = await supabase.from('LOGIN').select('*').eq('user_id', id).single();
      if (error) {
        throw error;
      }
      console.log(data);
      const Courses = await supabase.from('FACULTY').select('handled_courses').eq('email', data.email);
      console.log(Courses.data[0].handled_courses);
      setCourses(Courses.data[0].handled_courses)
    };

    getCourses();
    fetchFacultyId();
  }, [facultyEmail]);

  const handleAddQuestion = () => {
    if (!questionData.question || !questionData.prompt || !questionData.answer || !questionData.marks) {
      toast.error('Fill all fields!');
      return;
    }

    if (currentMarks + questionData.marks > totalMarks) {
      toast.warning('Total marks exceeded!');
      return;
    }

    setQuestionList([...questionList, { ...questionData }]);
    setCurrentMarks(currentMarks + questionData.marks);
    setQuestionData({ question: '', prompt: '', answer: '', marks: 0 });
  };

  const handleSubmit = async () => {
    if ( totalMarks !== currentMarks ) {
        toast.error("Marks Invalid!")
    }

    try {

      const questionEntries = {
        faculty_id: fid,
        exam_name: examname,
        academic: academicYear,
        question_paper_id: Math.floor(Math.random() * (10000000 - 9999 + 1) + 9999),
        course_id: selectedCourse,
        qap: questionList.map((q, index) => ({
          qid: index + 1,
          question: q.question,
          prompt: q.prompt,
          answer: q.answer,
          marks: q.marks
        }))
      };
      console.log(questionEntries)
      const { error } = await supabase.from('QATABLE').insert([questionEntries]);

      if (error) {
        alert('Error submitting questions to the database.');
      } else {
        alert('Questions submitted successfully!');
        setQuestionList([]);
        setTotalMarks(0);
        setCurrentMarks(0)
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
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
              <input
                type="text"
                value={examname}
                onChange={(e) => setExamname(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Enter exam name"
              />
            </div>

            <div className="flex-1 w-1/4 min-w-fit">
              <label className="block mb-2">Academic Year:</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Enter academic year"
              />
            </div>

            <div className="flex-1 w-1/4 min-w-fit ">
              <label className="block mb-2">Total Marks:</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value, 10))}
                className="p-2 border rounded w-full"
                placeholder="Enter total marks"
              />
            </div>

            <div className="flex-1 w-1/4 min-w-fit max-w-[17em]">
              <label className="block mb-2">Select Course:</label>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="p-2 border rounded w-full">
                <option value="">Select Course</option>
                {!Courses ? (
                  <option value="">Loading...</option>
                ) : (
                  Courses.map((course, index) => (
                    <option key={index} value={course.course}>
                      {course}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className='w-full flex justify-end mt-6'>
            {
              totalMarks === currentMarks &&
              <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
                  Submit Questions
              </button>
            }
          </div>
        </div>

        {
          totalMarks > currentMarks &&
          <QuestionForm 
            questionData={questionData}
            setQuestionData={setQuestionData}
            handleAddQuestion={handleAddQuestion}
            totalMarks={totalMarks}
            currentMarks={currentMarks}
            handleSubmit={handleSubmit}
          />
        } 
        
      </div>
      <QuestionList questionList={questionList} />
    </div>
  );
};

export default QAPaper;
