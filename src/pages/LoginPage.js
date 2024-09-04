import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie'; // Import the js-cookie library

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

      const { data: studentData } = await supabase
        .from('STUDENTLOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      const { data: facultyData } = await supabase
        .from('FACULTYLOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      console.log('Student Data:', studentData);
      console.log('Faculty Data:', facultyData);

      if (studentData && studentData.length > 0) {
        const user = studentData.find(user => user.password === trimmedPassword);
        if (user) {
          Cookies.set('user', JSON.stringify(user), { expires: 1 }); // Store in cookies
          localStorage.setItem('user', JSON.stringify(user)); // Store in local storage
          navigate('/student');
          return;
        }
      }

      if (facultyData && facultyData.length > 0) {
        const user = facultyData.find(user => user.password === trimmedPassword);
        if (user) {
          Cookies.set('user', JSON.stringify(user), { expires: 1 });
          localStorage.setItem('user', JSON.stringify(user));

          if (user.email.includes('hod')) {
            navigate('/hod');
          } else if (user.email.includes('ads') || user.email.includes('cs')) {
            navigate('/faculty');
          } else {
            setError('User role is not recognized.');
          }
          return;
        }
      }

      setError('Invalid email or password.');
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
