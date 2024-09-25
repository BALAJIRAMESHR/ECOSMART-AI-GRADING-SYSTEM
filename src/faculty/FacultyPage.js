import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
// import Cookies from 'js-cookie';

const MainContent = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        let user = null;
        if (session && session.user) {
          const userEmail = session.user.email;
          console.log('User email:', userEmail);
          const { data: facultyData } = await supabase
            .from('FACULTYLOGIN')
            .select('name')
            .eq('email', userEmail)
            .single();

          user = facultyData;
        } else {
          console.warn('No user session found, checking local storage.');
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            user = JSON.parse(storedUser);
          } else {
            console.warn('No user data in local storage or session.');
            setError('No user session found.');
            return;
          }
        }

        if (user) {
          setName(user.name);
        } else {
          setError('No user data found.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="ml-20 mt-16 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
      <h1>Dashboard</h1>
      <p>Welcome {name || 'User'} 👋</p>
    </div>
  );
};

export default MainContent;
