import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { supabase } from '../supabaseClient';
import HodCourseMapping from './HodCourseMapping'; // Ensure this import is correct

const HODPage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Session:', session);

        // Check if session is available
        if (session?.user?.email) {
          const userEmail = session.user.email;
          console.log('User email:', userEmail);
          
          // Fetch user data based on email from FACULTYLOGIN table
          const { data: facultyData, error: facultyError } = await supabase
            .from('FACULTYLOGIN')
            .select('name')
            .eq('email', userEmail)
            .single();

          if (facultyError) {
            console.error('Faculty data error:', facultyError);
            throw facultyError;
          }

          if (facultyData) {
            setName(facultyData.name);
          }
        } else {
          console.warn('No user session found, checking local storage.');
          
          // Check local storage as a fallback
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setName(user.name);
          } else {
            setError('No user session found.');
            navigate('/login'); // Redirect to login if no session found
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-lg mt-4">Welcome, {name || 'HOD'} 👋</p>
        <HodCourseMapping />
      </div>
    </div>
  );
};

export default HODPage;
