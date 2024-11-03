import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie'
import LoaderDesign from '../common/Loader';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const cookie = Cookies.get('cookie_user_id');

  const fetchStudent = async () => {
    try {
      if (!cookie) {
        throw new Error('No user ID found');
      }

      const { data, error } = await supabase
        .from('STUDENT')
        .select()
        .eq('user_id', cookie);
      
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No student data found');
      }
      setStudent(data[0]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [cookie]);

  if (loading) return <div><LoaderDesign/></div>;
  if (error) return <div className="p-24 text-red-600">{error}</div>;
  if (!student) return <div className="p-24">No student data available</div>;

  return (
    <div className="flex">
      <div className="p-24 flex-grow max-w-[70%] max-lg:max-w-[100%]">
        <h1 className="text-xl font-medium pb-2 text-blue-800">Student Profile</h1>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-neutral-600 font-normal">Roll Number:</div>
            <div className='text-black'>{student?.roll_no}</div>
            <div className="text-neutral-600 font-normal">Name:</div>
            <div className='text-black'>{student?.uname}</div>
            <div className="text-neutral-600 font-normal">Department:</div>
            <div className='text-black'>{student?.Department}</div>
            <div className="text-neutral-600 font-normal">Date of Birth:</div>
            <div className='text-black'>{student?.DOB}</div>
            <div className="text-neutral-600 font-normal">Gender:</div>
            <div className='text-black'>{student?.gender}</div>
            <div className="text-neutral-600 font-normal">Degree:</div>
            <div className='text-black'>{student?.degree}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;