import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { supabase } from '../supabaseClient';
import '../hod/hod.css';

const HODPage = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [profilePic, setProfilePic] = useState('https://example.com/default-profile.jpg');
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [contributionData, setContributionData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

          const { data: facultyData, error: facultyError } = await supabase
            .from('FACULTYLOGIN')
            .select('name, email, designation')
            .eq('email', userEmail)
            .single();

          if (facultyError) {
            throw facultyError;
          }

          user = facultyData;
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            user = JSON.parse(storedUser);
          } else {
            setError('No user session found.');
            return;
          }
        }

        if (user) {
          setName(user.name);
          setEmail(user.email);
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

  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = async () => {
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000 / 60 / 60; // Time in hours

      try {
        const { data, error } = await supabase
          .from('USER_TIME_SPENT')
          .insert([{ email, time_spent: timeSpent, date: new Date().toISOString().split('T')[0] }]);

        if (error) {
          console.error('Error saving time spent:', error);
        } else {
          console.log('Time spent saved successfully:', data);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [email]);

  useEffect(() => {
    const fetchContributionData = async () => {
      try {
        const { data, error } = await supabase
          .from('USER_TIME_SPENT')
          .select('date, time_spent')
          .eq('email', email);

        if (error) {
          console.error('Error fetching time spent:', error);
          return;
        }

        const contributionData = data.map((record) => ({
          date: record.date,
          count: Math.round(record.time_spent * 60) // Convert hours to minutes
        }));

        setContributionData(contributionData);

        const total = data.reduce((sum, record) => sum + record.time_spent, 0);
        setTotalTimeSpent(total);
      } catch (err) {
        console.error('Error fetching contribution data:', err);
      }
    };

    fetchContributionData();
  }, [email]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="max-screen flex flex-col items-center justify-start pt-28 bg-cover bg-center"
      style={{ backgroundImage: `url(${profilePic})` }}
    >
      <div className="flex flex-col items-center p-12 rounded-lg mb-8 w-full max-w-30">
        <img src={profilePic} alt="Profile" className="w-34 h-34 rounded-full mb-4" />
        <div className="text-center">
          <h2 className="text-4xl font-bold">{name}</h2>
          <p className=" text-2xl text-gray-600">{email}</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-lg  mb-8 w-full max-w-7xl">
        <h3 className="text-2xl font-semibold text-center mb-6">Department Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-52">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center content-center">
            <h4 className="text-3xl font-bold">120</h4>
            <p className="font-semibold text-gray-700">Number Of Students</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center content-center">
            <h4 className="text-3xl font-bold">30</h4>
            <p className="font-semibold text-gray-700">Number of Teachers</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg shadow-md text-center content-center">
            <h4 className="text-3xl font-bold">32</h4>
            <p className="font-semibold text-gray-700">Total Courses</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg h-full w-full max-w-5xl">
        <h3 className="text-2xl font-semibold text-center mb-6">Overall Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-52">
          <div className="bg-orange-100 p-6 rounded-lg text-center content-center">
            <h4 className="text-xl font-semibold">Total Contribution</h4>
            <p className="mt-4 font-bold text-3xl text-black-700">{contributionData.length} days</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg text-center content-center">
            <h4 className="text-xl font-semibold">Total Hours Spent</h4>
            <p className="mt-4 font-bold text-3xl text-black-700">{totalTimeSpent.toFixed(2)} Hours</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-center mb-6">Contribution Overview</h3>
        <div className="relative">
          <CalendarHeatmap
            startDate={new Date(new Date().getFullYear(), 0, 1)}
            endDate={new Date()}
            values={contributionData}
            classForValue={(value) => {
              if (!value) {
                return 'color-empty';
              }
              return `color-scale-${Math.min(Math.floor(value.count / 60), 4)}`;
            }}
            tooltipDataAttrs={(value) => {
              if (!value.date) {
                return { 'data-tip': 'No contributions' };
              }
              return {
                'data-tip': `${value.date}: ${value.count} minutes`,
              };
            }}
            showWeekdayLabels
            gutterSize={2} // Adjust to control the gap between months
            horizontal
          />
        
        </div>
      </div>
    </div>
  );
};

export default HODPage;
