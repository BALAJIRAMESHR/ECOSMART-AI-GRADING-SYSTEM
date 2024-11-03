import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
import { PartyPopper, Frown } from 'lucide-react';
import LoaderDesign from '../common/Loader';

const Result = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        if (!questionId) {
          throw new Error('Question ID is missing');
        }

        const userId = Cookies.get('cookie_user_id');
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const { data: responseData, error: responseError } = await supabase
          .from('RESULTS')
          .select('marks, result, question_paper_id, user_id')
          .eq('user_id', userId)
          .eq('question_paper_id', questionId);

        if (responseError) throw responseError;

        const { data: examData, error: examError } = await supabase
          .from('QATABLE')
          .select('question_paper_id, exam_name, course_id')
          .eq('question_paper_id', questionId)
          .single();

        if (examError) throw examError;

        if (!responseData || responseData.length === 0) {
          throw new Error('No result found for this test');
        }

        setResultData(responseData[0]);
        setExamDetails(examData);
        
        // Trigger animation after data is loaded
        setTimeout(() => setShowAnimation(true), 500);
      } catch (error) {
        console.error('Error in fetchResultData:', error);
        setError(error.message || 'Failed to load result data');
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [questionId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoaderDesign />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md w-full">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!resultData || !examDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md w-full">
          <p className="text-gray-500 text-lg">No result found for this test.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isPassed = resultData.result?.toLowerCase() === 'pass';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors flex items-center"
        >
          <span>← Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className={`p-6 text-white ${isPassed ? 'bg-green-600' : 'bg-red-600'} transition-colors duration-500`}>
            <h1 className="text-2xl font-bold">{examDetails.exam_name || 'Test Result'}</h1>
            <p className="text-white/80 mt-2">Course: {examDetails.course_id || 'N/A'}</p>
          </div>
          
          <div className="p-6">
            <div className={`text-center transition-all duration-700 transform ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              {isPassed ? (
                <div className="mb-8">
                  <div className="animate-bounce">
                    <PartyPopper className="w-20 h-20 mx-auto text-green-500 mb-4" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h2>
                  <p className="text-gray-600">You've successfully passed the exam!</p>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="animate-pulse">
                    <Frown className="w-20 h-20 mx-auto text-red-500 mb-4" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Keep Going!</h2>
                  <p className="text-gray-600">Don't give up - try again!</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                <div className={`p-6 rounded-lg ${showAnimation ? 'animate-fade-in-up' : ''}`}
                     style={{
                       animation: showAnimation ? 'slideIn 0.5s ease-out' : 'none',
                     }}>
                  <p className="text-sm text-gray-500 mb-1">Your Score</p>
                  <p className="text-4xl font-bold text-gray-800">{resultData.marks || 0}</p>
                </div>

                <div className={`p-6 rounded-lg ${showAnimation ? 'animate-fade-in-up' : ''}`}
                     style={{
                       animation: showAnimation ? 'slideIn 0.5s ease-out 0.2s' : 'none',
                       animationFillMode: 'backwards'
                     }}>
                  <p className="text-sm text-gray-500 mb-1">Result Status</p>
                  <p className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {resultData.result || 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default Result;