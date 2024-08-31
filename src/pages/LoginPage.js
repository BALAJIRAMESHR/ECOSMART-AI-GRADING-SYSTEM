import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log('Querying with email:', trimmedEmail);

      // Query the student login table for a user with the given email
      const { data: studentData, error: studentError } = await supabase
        .from('STUDENTLOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      if (studentError) {
        console.error('Student Error:', studentError);
        setError('Error fetching student data.');
        return;
      }

      // Query the faculty login table for a user with the given email
      const { data: facultyData, error: facultyError } = await supabase
        .from('FACULTYLOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      if (facultyError) {
        console.error('Faculty Error:', facultyError);
        setError('Error fetching faculty data.');
        return;
      }

      console.log('Student Data:', studentData);
      console.log('Faculty Data:', facultyData);

      // Check if the email exists in the student data
      const studentUser = studentData.find(user => user.password === trimmedPassword);
      if (studentUser) {
        if (studentUser.email.includes('hod')) {
          navigate('/hod');
        } else if (studentUser.email.includes('ads') || studentUser.email.includes('cs')) {
          navigate('/faculty');
        } else {
          navigate('/student');
        }
        return;
      }

      // Check if the email exists in the faculty data
      const facultyUser = facultyData.find(user => user.password === trimmedPassword);
      if (facultyUser) {
        if (facultyUser.email.includes('hod')) {
          navigate('/hod');
        } else if (facultyUser.email.includes('ads') || facultyUser.email.includes('cs')) {
          navigate('/faculty');
        } else {
          navigate('/faculty'); // Default faculty page if the role is not recognized
        }
        return;
      }

      setError('Invalid login credentials.');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">Login</h1>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
