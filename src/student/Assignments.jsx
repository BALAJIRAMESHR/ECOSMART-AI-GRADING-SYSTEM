import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoaderDesign from '../common/Loader';

const QATableData = () => {
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [hasResponses, setHasResponses] = useState(false); // New state to check for user responses

  // First fetch user ID from cookies
  useEffect(() => {
    const id = Cookies.get('id');
    setUserId(id);
  }, []);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!userId) return;

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
    };

    fetchStudentCourses();
  }, [userId]);

  // Fetch questions and check completed status
  useEffect(() => {
    const fetchQuestionsAndStatus = async () => {
      if (!userId || Object.keys(enrolledCourses).length === 0) return;

      try {
        // First get all questions for enrolled courses
        const allQuestions = [];
        for (const semester in enrolledCourses) {
          const courses = enrolledCourses[semester];
          for (const courseId of courses) {
            const { data, error } = await supabase
              .from('QATABLE')
              .select('*')
              .eq('course_id', courseId);

            if (error) throw error;
            if (data) allQuestions.push(...data);
          }
        }

        // Fetch responses for the current user
        const { data: responseData, error: responseError } = await supabase
          .from('RESPONSES')
          .select('qid, user_id')
          .eq('user_id', userId);

        if (responseError) throw responseError;

        // Check if the user has any responses
        setHasResponses(responseData && responseData.length > 0);

        // Create a set of completed question IDs that belong to the current user
        const completedIds = new Set(
          responseData?.map(response => response.qid) || []
        );

        // Split questions into completed and assigned
        const completed = allQuestions.filter(q => completedIds.has(q.question_paper_id));
        const assigned = allQuestions.filter(q => !completedIds.has(q.question_paper_id));

        setCompletedQuestions(completed);
        setAssignedQuestions(assigned);
      } catch (error) {
        console.error('Error fetching questions and status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionsAndStatus();
  }, [userId, enrolledCourses]);

  const QuestionCard = ({ question }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-blue-500 transition-all">
      <Link 
        to={`test/${question.question_paper_id}`} 
        state={{ questionId: question.question_paper_id }}
        className="block"
      >
        <h3 className="font-medium text-gray-800 hover:text-blue-600">
          {question.exam_name}
        </h3>
        <div className="text-sm text-gray-600 mt-2">
          Course: {question.course_id}
        </div>
      </Link>
    </div>
  );

  if (isLoading) {
    return <LoaderDesign />;
  }

  return (
    <div className="p-6">
      {/* Assigned Questions */}
      <section className="mb-8">
        <h2 className="text-xl font-medium text-blue-600 mb-4">
          Assigned Questions
        </h2>
        {assignedQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedQuestions.map((question) => (
              <QuestionCard 
                key={`assigned-${question.question_paper_id}`} 
                question={question} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No assigned questions available.</p>
        )}
      </section>

      {/* Completed Questions */}
      <section>
        <h2 className="text-xl font-medium text-blue-600 mb-4">
          Completed Questions
        </h2>
        {hasResponses && completedQuestions.length > 0 ? ( // Only show completed questions if the user has responses
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedQuestions.map((question) => (
              <QuestionCard 
                key={`completed-${question.question_paper_id}`} 
                question={question} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No completed questions yet.</p>
        )}
      </section>
    </div>
  );
};

export default QATableData;
