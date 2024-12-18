import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoaderDesign from '../common/Loader';

const QATableData = () => {
  const [questions, setQuestions] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [completedResponses, setCompletedResponses] = useState(new Set());
  const navigate = useNavigate();

  // Fetch user ID from cookies
  useEffect(() => {
    const id = Cookies.get('cookie_user_id');
    if (!id) {
      navigate('/login');
      return;
    }
    setUserId(id);
  }, [navigate]);

  // Fetch completed responses
  useEffect(() => {
    const fetchCompletedResponses = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('RESPONSES')
          .select('qid')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching completed responses:', error);
          return;
        }

        const completedQids = new Set(data.map(response => response.qid));
        setCompletedResponses(completedQids);
      } catch (error) {
        console.error('Error in fetchCompletedResponses:', error);
      }
    };

    fetchCompletedResponses();
  }, [userId]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('LOGIN')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching data from LOGIN:', error);
          return;
        }

        const email = data?.email;
        if (email) {
          const { data: studentData, error: studentError } = await supabase
            .from('STUDENT')
            .select('enrolled_course')
            .eq('email', email)
            .single();

          if (studentError) {
            console.error('Error fetching data from STUDENT:', studentError);
          } else if (studentData) {
            setEnrolledCourses(studentData.enrolled_course);
          }
        }
      } catch (error) {
        console.error('Error fetching student courses:', error);
      }
    };

    fetchStudentCourses();
  }, [userId]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!userId || Object.keys(enrolledCourses).length === 0) return;

      try {
        const allQuestions = new Set();
        for (const semester in enrolledCourses) {
          const courses = enrolledCourses[semester];
          for (const courseId of courses) {
            const { data, error } = await supabase
              .from('QATABLE')
              .select('*')
              .eq('course_id', courseId);

            if (error) throw error;
            if (data) {
              data.forEach(question => {
                if ([...allQuestions].every(q => q.question_paper_id !== question.question_paper_id)) {
                  allQuestions.add(question);
                }
              });
            }
          }
        }

        setQuestions([...allQuestions]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, enrolledCourses]);

  const handleStartTest = async (questionId) => {
    try {
      // Check if user has already attempted this test
      const { data: existingAttempt, error: checkError } = await supabase
        .from('RESPONSES')
        .select('qid')
        .eq('user_id', userId)
        .eq('qid', questionId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking test attempt:', checkError);
        return;
      }

      if (existingAttempt) {
        alert('You have already attempted this test. You cannot retake it.');
        return;
      }

      // If no existing attempt, proceed to the test
      navigate(`test/${questionId}`, { state: { questionId } });

    } catch (error) {
      console.error('Error handling test start:', error);
      alert('There was an error starting the test. Please try again.');
    }
  };

  const QuestionCard = ({ question, isCompleted }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:border-blue-500 transition-all min-h-[200px] flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {question.exam_name}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          Course: {question.course_id}
        </div>
      </div>
      
      {isCompleted ? (
        <div className="flex justify-between items-center mt-4">
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
            Completed
          </span>
          <Link
            to={`/results/${question.question_paper_id}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Result
          </Link>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-4">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium">
            Pending
          </span>
          <button 
            onClick={() => handleStartTest(question.question_paper_id)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Test
          </button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <LoaderDesign />;
  }

  const assignedQuestions = questions.filter(q => !completedResponses.has(q.question_paper_id));
  const completedQuestions = questions.filter(q => completedResponses.has(q.question_paper_id));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Assigned Questions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Assigned 
            </h2>
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-medium">
              {assignedQuestions.length} Pending
            </span>
          </div>
          
          {assignedQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedQuestions.map((question) => (
                <QuestionCard 
                  key={question.question_paper_id} 
                  question={question}
                  isCompleted={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg">No assigned questions available.</p>
            </div>
          )}
        </section>

        {/* Completed Questions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Completed 
            </h2>
            <span className="px-4 py-2 bg-green-100 text-green-600 rounded-full font-medium">
              {completedQuestions.length} Completed
            </span>
          </div>
          
          {completedQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedQuestions.map((question) => (
                <QuestionCard 
                  key={question.question_paper_id} 
                  question={question}
                  isCompleted={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg">No completed questions yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default QATableData;