import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExamContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [questionId, setQuestionId] = useState(id || "");
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});

  useEffect(() => {
    if (location.state && location.state.questionId) {
      setQuestionId(location.state.questionId);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (questionId) {
        const { data, error } = await supabase.from("QATABLE").select("qap").eq("question_paper_id", questionId);

        if (error) {
          console.error("Error fetching questions:", error);
        } else {
          setQuestions(data[0]?.qap || []);
        }
      }
    };

    fetchQuestions();
  }, [questionId]);

  const handleAnswerChange = (qid, value) => {
    setStudentAnswers({ ...studentAnswers, [qid]: value });
  };

  const handleSubmit = async () => {
    const id = Cookies.get('id');
    const { data, error } = await supabase.from('LOGIN').select('*').eq('user_id', id).single();
      if (error) {
        throw error;
      }
    console.log(data.email)
    if (data.email) {
      const submissionData = {
          qid:questionId,
          answers: studentAnswers,
          email: data.email,
      };

      const { error } = await supabase.from("RESPONSES").insert([submissionData]);
      if (error) {
        console.error("Error submitting answers:", error);
        alert("Failed to submit answers.");
      } else {
          setStudentAnswers({})
          toast.error('Fill all fields!');
          navigate('/student');
          return
      }
    }
  };

  return (
    <div className="min-h-screen w-[50%] mx-auto py-6">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover={false} theme="light"/>
      <div className="text-center w-full mt-4 font-medium text-xl">Exam</div>
      <div className="mt-6">
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <div className="font-semibold">
              Question {index+1}:
            </div>
            <div>{q.question}</div>
            <textarea
              className="mt-2 p-2 border rounded w-full"
              placeholder="Type your answer here..."
              value={studentAnswers[q.qid] || ""}
              onChange={(e) => handleAnswerChange(q.qid, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
}

export default ExamContainer;
