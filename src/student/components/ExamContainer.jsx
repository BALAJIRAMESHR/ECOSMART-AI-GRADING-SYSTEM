import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import LoaderDesign from "../../common/Loader";

function ExamContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [questionId, setQuestionId] = useState(id || "");
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [CourseId, setCourseId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user_id from cookie instead of localStorage
        const userId = Cookies.get('cookie_user_id');
        
        if (!userId) {
          toast.error('User session expired. Please log in again.');
          navigate('/login');
          return;
        }

        // Fetch current user data from database
        const { data: userData, error } = await supabase
          .from('LOGIN')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error || !userData) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to verify user session. Please log in again.');
          navigate('/');
          return;
        }

        // Remove sensitive data before setting to state
        const sanitizedUserData = {
          email: userData.email,
          user_id: userData.user_id,
          designation: userData.designation,
          active: userData.active
        };

        setUserInfo(sanitizedUserData);

      } catch (err) {
        console.error('Error in fetchUserData:', err);
        toast.error('Session verification failed. Please log in again.');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.questionId) {
      setQuestionId(location.state.questionId);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!questionId) {
          toast.error('Question ID is missing');
          return;
        }

        const { data, error } = await supabase
          .from("QATABLE")
          .select("*")
          .eq("question_paper_id", questionId);
          
        if (error || !data || data.length === 0) {
          throw new Error('No questions found for this question paper ID');
        }
        
        if (!data || data.length === 0) {
          toast.error('No questions found for this question paper ID');
          return;
        }
        
        setCourseId(data[0].course_id);
        const questionsWithoutPrompts = data.flatMap(row => 
          row.qap.map(q => ({
            qid: q.qid,
            question: q.question,
            marks: q.marks
          }))
        );

        setQuestions(questionsWithoutPrompts);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error('Failed to load questions');
      }
    };

    fetchQuestions();
  }, [questionId]);

  const handleAnswerChange = (qid, value) => {
    setStudentAnswers(prev => ({
      ...prev,
      [qid]: value
    }));
  };

  const validateAnswers = () => {
    const unansweredQuestions = questions.filter(
      q => !studentAnswers[q.qid] || studentAnswers[q.qid].trim() === ''
    );

    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return false;
    }

    return true;
  };

  const StoreResults = async (result) => { 

    console.log("Storing results:", result);
    console.log("marks:", result.result.final_score);

    const submissionResults = {
      question_paper_id: questionId,
      course_id: CourseId,
      email_id: userInfo.email,
      user_id: userInfo.user_id,
      result: "Pass",
      marks: result.result.final_score,
      qa: result.result.result,
    };

    console.log(submissionResults)

    const { error: submitError } = await supabase
      .from("RESULTS")
      .insert([submissionResults]);

    if (submitError) {
      console.error("Submission error:", submitError);
      toast.error('Failed to submit answers. Please try again.');
      return;
    }

    toast.success('Answers submitted successfully!');

  }

  const EvaluatingExam = async () => {
    const url = "http://127.0.0.1:8000/get_result";
    console.log(questionId, userInfo.email);
  
    const data = {
      "qap_id": String(questionId),
      "email_id": String(userInfo.email)  
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Response:", response.data);
      // Store the result in Supbase
      await StoreResults(response.data);

    } catch (error) {
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else {
        console.error("Failed with error:", error.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!validateAnswers()) {
        setIsSubmitting(false);
        return;
      }

      if (!userInfo || !userInfo.email || !userInfo.user_id) {
        toast.error('Could not verify user information. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Check if user has already submitted
      const { data: existingResponse, error: fetchError } = await supabase
        .from("RESPONSES")
        .select("*")
        .eq("user_id", userInfo.user_id)
        .eq("qid", questionId);

      if (fetchError) {
        console.error("Fetch error while checking existing responses:", fetchError);
        toast.error('Failed to check existing responses. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (existingResponse && existingResponse.length > 0) {
        toast.error('You have already submitted answers for this exam.');
        setIsSubmitting(false);
        return;
      }

      const submissionData = {
        qid: questionId,
        answers: studentAnswers,
        email: userInfo.email,
        user_id: userInfo.user_id,
        created_at: new Date().toISOString()
      };

      const { error: submitError } = await supabase
        .from("RESPONSES")
        .insert([submissionData]);

      if (submitError) {
        console.error("Submission error:", submitError);
        toast.error('Failed to submit answers. Please try again.');
        return;
      }

      toast.success('Answers submitted successfully!');
      toast.warning("We are evaluating the exam. Please wait for the results.");
      setIsLoading(true);

      // Evaluate the exam in Backend and redirect to student dashboard
      await EvaluatingExam();

      setStudentAnswers({});

      setTimeout(() => {
        navigate('/student');
      }, 1500);

    } catch (error) {
      console.error("Unexpected error during submission:", error);
      toast.error('Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen w-[50%] mx-auto py-6">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover={false} theme="light"/>
        {
          isLoading ? <LoaderDesign /> : null
        }
        <div className="text-center w-full mt-4 font-medium text-xl">
          Exam
          {userInfo && (
            <div className="text-sm text-gray-600 mt-2">
              Logged in as: {userInfo.email}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          {questions.length === 0 ? (
            <div className="text-center text-gray-500">No questions available</div>
          ) : (
            questions.map((q, index) => (
              <div key={q.qid || index} className="mb-6 p-4 bg-white rounded-lg shadow">
                <div className="font-semibold mb-2">
                  Question {index + 1}: <span className="text-gray-600">({q.marks} marks)</span>
                </div>
                <div className="mb-3">{q.question}</div>
                <textarea
                  className="mt-2 p-3 border rounded-md w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your answer here..."
                  value={studentAnswers[q.qid] || ""}
                  onChange={(e) => handleAnswerChange(q.qid, e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            ))
          )}

          {questions.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full bg-blue-500 text-white p-3 rounded-lg mt-4 font-medium
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
              `}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answers'}
            </button>
          )}
        </div>
      </div>
  );
}

export default ExamContainer;