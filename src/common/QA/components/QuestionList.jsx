import React from 'react';

const QuestionList = ({ questionList }) => {
  return (
    <div className="w-full max-h-screen overflow-scroll">
      {questionList.length !== 0 && (
        <h3 className="text-lg font-semibold mb-2">Question List:</h3>
      )}
      {questionList.map((q, index) => (
        <div key={index} className="border p-4 mb-2 rounded">
          <div><strong>Question:</strong> {q.question}</div>
          <div><strong>Prompt:</strong> {q.prompt}</div>
          <div><strong>Answer:</strong> {q.answer}</div>
          <div><strong>Marks:</strong> {q.marks}</div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
