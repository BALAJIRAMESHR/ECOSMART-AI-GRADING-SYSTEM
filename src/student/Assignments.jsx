import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const QATableData = () => {
  const [qaData, setQaData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('QATABLE').select('*');

      if (error) {
        console.error('Error fetching data from QATABLE:', error);
      } else {
        setQaData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='px-6 py-10'>
      <h2 className="text-xl font-medium text-blue-600 mb-">Assignments</h2>
      {qaData.length > 0 ? (
        <div className='py-3 flex gap-4'>
          {qaData.map((entry, index) => (
            <Link to={`test/${entry.question_paper_id}`} key={index} state={{ questionId: entry.question_paper_id }}>
              <div className="border flex gap-6 px-4 py-2 mb-2 cursor-pointer hover:text-blue-600">
                <div className='font-medium'>{entry.exam_name}</div> 
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No data found in QATABLE.</p>
      )}
    </div>
  );
};

export default QATableData;
