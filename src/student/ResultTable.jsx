import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
import { User, BookOpen, Award, School } from 'lucide-react';

const ResultTable = () => {
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    student: null,
    exam: null,
    result: null,
    course: null,
    questions: [],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = Cookies.get('id');
        if (!userId || !questionId) {
          console.error('Missing userId or questionId');
          return;
        }

        // Fetch student details
        const { data: studentData, error: studentError } = await supabase
          .from('STUDENT')
          .select(`
            user_id,
            uname,
            email,
            Department,
            roll_no,
            degree,
            gender
          `)
          .eq('user_id', userId)
          .single();

        if (studentError) throw studentError;

        // Fetch exam details with course info
        const { data: examData, error: examError } = await supabase
          .from('QATABLE')
          .select(`
            *,
            course:question_paper_id(
              course_id,
              exam_name
            )
          `)
          .eq('question_paper_id', questionId)
          .single();

        if (examError) throw examError;

        // Fetch result with detailed responses
        const { data: resultData, error: resultError } = await supabase
          .from('RESPONSES')
          .select(`
            *,
            student:user_id (
            )
          `)
          .eq('user_id', userId)
          .eq('qid', questionId)
          .single();

        if (resultError) throw resultError;

        setData({
          student: studentData,
          exam: examData,
          result: resultData,
          course: examData.course,
          questions: examData.qap || []
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [questionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.student || !data.exam || !data.result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-8 text-center">
            <p className="text-lg text-gray-600">No data found.</p>
          </div>
        </div>
      </div>
    );
  }

  const calculateProgress = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    return Math.round(percentage);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Exam Result Details
          </h1>
          <p className="text-gray-600">
            {data.exam.exam_name} | {data.course?.course_code}
          </p>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{data.student.uname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{data.student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="font-medium">{data.student.roll_no}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{data.student.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Degree</p>
                  <p className="font-medium">{data.student.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="font-medium">{data.student.academic_year}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{data.student.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{data.student.phone_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course & Exam Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Course Name</p>
                <p className="font-medium">{data.course?.course_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Code</p>
                <p className="font-medium">{data.course?.course_code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{data.course?.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Credits</p>
                <p className="font-medium">{data.course?.credits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Result Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Questions</p>
                    <p className="font-medium">{data.questions.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Marks</p>
                    <p className="font-medium">{data.exam.total_marks}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Score</p>
                  <div className="flex items-end gap-2">
                    <p className="font-bold text-3xl text-blue-700">
                      {data.result.marks}
                    </p>
                    <p className="text-lg text-blue-500 mb-1">
                      / {data.exam.total_marks}
                    </p>
                  </div>
                  <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ 
                        width: `${calculateProgress(data.result.marks, data.exam.total_marks)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {calculateProgress(data.result.marks, data.exam.total_marks)}% Score
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Responses */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <School className="h-5 w-5" />
              Question-wise Analysis
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {data.questions.map((question, index) => (
                <div 
                  key={question.qid}
                  className="border-b border-gray-200 last:border-0 pb-8 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        Q{index + 1}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        Marks: {question.marks}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Question:</p>
                      <p className="text-gray-800">{question.question}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-2">Your Answer:</p>
                      <p className="text-gray-800">
                        {data.result.answers?.[question.qid] || 'No answer provided'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {data.result.feedback && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <School className="h-5 w-5" />
                Examiner's Feedback
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-line">
                {data.result.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultTable;