import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
import LoaderDesign from '../common/Loader';

const HODPage = () => {
  const [loading, setLoading] = useState(true);
  const [hodData, setHodData] = useState(null);
  const [error, setError] = useState(null);
  const cookie = Cookies.get('cookie_user_id');

  const fetchHODData = async () => {
    try {
      if (!cookie) {
        throw new Error('No user ID found. Please log in again.');
      }

      console.log('Fetching HOD data for ID:', cookie);

      // Fetch HOD data including department details
      const { data: userData, error: userError } = await supabase
        .from('FACULTY')
        .select(
          `
          fid,
          email,
          designation,
          DEPARTMENT:department_id (
            department_name
          )
        `
        )
        .eq('fid', cookie)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
        throw new Error('Failed to fetch HOD data.');
      }

      if (!userData) {
        throw new Error('No user data found for the given ID.');
      }

      // Set combined data to state
      const combinedData = {
        ...userData,
        department: userData.DEPARTMENT?.department_name || 'Not assigned',
      };

      console.log('Retrieved HOD data:', combinedData);
      setHodData(combinedData);
    } catch (error) {
      console.error('Error fetching HOD data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHODData();
  }, [cookie]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoaderDesign />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!hodData) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded relative">
          No HOD data available
        </div>
      </div>
    );
  }

  const profileData = [
    { label: 'Email', value: hodData.email },
    { label: 'Designation', value: hodData.designation },
    { label: 'Department', value: hodData.department },
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-medium text-blue-800">HOD Profile</h1>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.map((item, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <span className="text-neutral-600 font-normal">{item.label}:</span>
                <span className="text-black font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODPage;
