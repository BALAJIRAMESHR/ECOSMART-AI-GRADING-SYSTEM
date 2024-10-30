import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExamContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [questionId, setQuestionId] = useState(id || "");
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info from local storage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      console.log("Found user data from local storage:", storedUser);
      setUserInfo(storedUser);
    } else {
      toast.error('User session expired. Please log in again.');
      navigate('/login');
    }
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
          .select("qap")
          .eq("question_paper_id", questionId);

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          toast.error('No questions found');
          return;
        }

        const questionsWithoutPrompts = data[0]?.qap.map(q => ({
          qid: q.qid,
          question: q.question,
          marks: q.marks
        })) || [];

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
      // toast.error(Please answer all questions. ${unansweredQuestions.length} question(s) remaining.);
      return false;
    }

    return true;
  };

const handleSubmit = async () => {
  try {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!validateAnswers()) {
      setIsSubmitting(false);
      return;
    }

    if (!userInfo || !userInfo.email) {
      toast.error('Could not verify user information. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Check if the user has already submitted a response for this questionId
    const { data: existingResponse, error: fetchError } = await supabase
      .from("RESPONSES")
      .select("*")
      .eq("user_id", userInfo.user_id)
      .eq("qid", questionId); // Check by both user_id and qid

    if (fetchError) {
      console.error("Fetch error while checking existing responses:", fetchError);
      toast.error('Failed to check existing responses. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Check if a response exists
    if (existingResponse && existingResponse.length > 0) {
      toast.error('You have already submitted answers for this question.');
      setIsSubmitting(false);
      return;
    }

    // Proceed with submission if no existing response
    const submissionData = {
      qid: questionId,
      answers: studentAnswers,
      email: userInfo.email,
      user_id: userInfo.user_id
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
    setStudentAnswers({});

    setTimeout(() => {
      navigate('/student'); // Redirect to the student page after submission
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
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss={false} 
        draggable 
        pauseOnHover={false} 
        theme="light"
      />
      
      <div className="text-center w-full mt-4 font-medium text-xl">Exam</div>
      
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