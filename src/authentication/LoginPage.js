import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
import images from "../assets/laptop.jpeg";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      const { data: studentData } = await supabase
        .from('STUDENTLOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      const { data: facultyData } = await supabase
        .from('FACULTYLOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      if (studentData && studentData.length > 0) {
        const user = studentData.find(user => user.password === trimmedPassword);
        if (user) {
          Cookies.set('user', JSON.stringify(user), { expires: 1 });
          localStorage.setItem('user', JSON.stringify(user));
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

  const handleForgotPassword = () => {
    navigate('/forgot');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-lg flex">
        {/* Image Section */}
        <div className="w-1/2">
          <img src={images} alt="Graduation" className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="w-1/2 p-24 flex flex-col justify-center">
          <div className="text-left mb-8">
            <h1 className="text-xl font-bold text-center text-black-800">Kumaraguru College of Technology</h1>
            <h2 className="text-lg text-left text-black-800 mt-8">Sign In</h2>
            <p className="mt-2 text-sm text-left text-gray-700">
              The key to happiness is to sign in.
            </p>
          </div>
          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-100 border border-red-300 rounded p-2">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-lg font text-black-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-2 py-2 mt-1 text-xs border rounded focus:outline-none focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block text-lg font text-black-800">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 mt-1 text-xs border rounded focus:outline-none focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  disabled={loading}
                />
                <label htmlFor="show-password" className="text-sm font text-black-800">
                  Show Password
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:no-underline focus:outline-none"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
