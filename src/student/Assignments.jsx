import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoaderDesign from '../common/Loader';

const QATableData = () => {
  const [qaData, setQaData] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [Loader, SetLoader] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      const allQuestions = [];
      
      for (const semester in enrolledCourses) {
        const courses = enrolledCourses[semester];
        
        for (const courseId of courses) {
          const { data, error } = await supabase.from('QATABLE').select('*').eq("course_id", courseId);

          if (error) {
            console.error('Error fetching data from QATABLE:', error);
          } else if (data) {
            allQuestions.push(...data);
          }
        }
      }
      
      setQaData(allQuestions);
      SetLoader(false)
    };

    if (Object.keys(enrolledCourses).length > 0) {
      fetchData();
    }
  }, [enrolledCourses]);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      const id = Cookies.get('cookie_user_id');
      const { data, error } = await supabase.from('LOGIN').select('*').eq('user_id', id).single();

      if (error) {
        console.error('Error fetching data from LOGIN:', error);
        return;
      }

      const email = data?.email;
      if (email) {
        const { data: studentData, error: studentError } = await supabase.from('STUDENT').select('enrolled_course').eq("email", email).single();

        if (studentError) {
          console.error('Error fetching data from STUDENT:', studentError);
        } else if (studentData) {
          setEnrolledCourses(studentData.enrolled_course);
        }
      }
    };
    fetchStudentCourses();
  }, []);

  return (
    <>
      {
        Loader ?
        <LoaderDesign />
        :
        <div className='px-6 py-10'>
          <h2 className="text-xl font-medium text-blue-600 mb-4">Assignments</h2>
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
            <p className='pt-4'>No assignments available.</p>
          )}
        </div>
      }
    </>
  );
};

export default QATableData;
