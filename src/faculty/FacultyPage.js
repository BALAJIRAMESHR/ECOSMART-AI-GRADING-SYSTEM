import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
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
        .from('FACULTY')
        .select(`
          *,
          DEPARTMENT:department_id (
            department_name
          )
        `)
        .eq('fid', cookie)
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error('No faculty data found');
      }
      setStudent(data);
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
      <div className="p-24 flex-grow max-w-[90%] max-lg:max-w-[100%]">
        <h1 className="text-xl font-medium pb-2 text-green-800">Faculty Profile</h1>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-neutral-600 font-normal">Name:</div>
            <div className='text-black'>{student?.faculty_name}</div>
            
            <div className="text-neutral-600 font-normal">Email:</div>
            <div className='text-black'>{student?.email}</div>
            
            <div className="text-neutral-600 font-normal">Designation:</div>
            <div className='text-black'>{student?.designation}</div>
            
            <div className="text-neutral-600 font-normal">Department:</div>
            <div className='text-black'>{student?.DEPARTMENT?.department_name || 'Not assigned'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;