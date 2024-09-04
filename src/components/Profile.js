import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserProfile = async (email) => {
    try {
      // Fetch student profile
      const { data: student, error: studentError } = await supabase
        .from('STUDENTLOGIN')
        .select('*')
        .eq('email', email)
        .single();

      if (student) {
        setUser({ ...student, role: 'student' });
        return;
      }

      // Fetch faculty profile
      const { data: faculty, error: facultyError } = await supabase
        .from('FACULTYLOGIN')
        .select('*')
        .eq('email', email)
        .single();

      if (faculty) {
        setUser({ ...faculty, role: 'faculty' });
      } else {
        setError('User not found in both tables');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Error fetching user profile');
    } finally {
      setLoading(false);
    }
  };

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        setError('Error fetching session');
        setLoading(false);
        return;
      }

      if (session?.user?.email) {
        fetchUserProfile(session.user.email);
      } else {
        // Check local storage for user data as a fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUser(user);
          setLoading(false); // Set loading to false if data is found in local storage
        } else {
          setError('No user session found.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Error fetching session');
      setLoading(false);
    }
  };

  useEffect(() => {
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        fetchUserProfile(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setError('User signed out');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <div>
        <p><strong>Email:</strong> {user?.email || 'No email available'}</p>
        <p><strong>Name:</strong> {user?.name || 'No name available'}</p>
        {user?.role === 'faculty' && (
          <>
            <p><strong>Designation:</strong> {user?.designation || 'No designation available'}</p>
            <p><strong>Department ID:</strong> {user?.did || 'No department ID available'}</p>
          </>
        )}
        {user?.role === 'student' && (
          <>
            <p><strong>Student ID:</strong> {user?.student_id || 'No student ID available'}</p>
            <p><strong>Course:</strong> {user?.course || 'No course available'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
