import React from "react";
import { toast } from "react-toastify";

const QuestionForm = ({
  questionData,
  setQuestionData,
  handleAddQuestion,
  totalMarks,
  currentMarks,
  handleSubmit,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: name === "marks" ? parseInt(value, 10) : value,
    });
  };

  return (
    <div>
        <div className="mb-4">
        <label className="block mb-2">Question:</label>
        <input type="text" name="question" value={questionData.question} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Enter question"/>
        </div>

        <div className="mb-4">
        <label className="block mb-2">Prompt:</label>
        <input type="text" name="prompt" value={questionData.prompt} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Enter prompt"/>
        </div>

        <div className="mb-4">
        <label className="block mb-2">Answer:</label>
        <textarea name="answer" value={questionData.answer} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Enter answer"
        />
        </div>

        <div className="mb-4">
        <label className="block mb-2">Marks:</label>
        <input type="number" name="marks" value={questionData.marks} onChange={handleInputChange} className="p-2 border rounded w-full" placeholder="Enter marks for this question"/>
        </div>

    
        <div className="w-full items-center justify-between flex mt-10">
            <button onClick={handleAddQuestion} className="bg-green-500 text-white p-2 rounded mb-4">
                Add Question
            </button>
        </div>
    </div>
  );
};

export default QuestionForm;
