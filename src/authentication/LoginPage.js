import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const cookie_user_id = Cookies.get('cookie_user_id');
      if (!cookie_user_id) {
        return;
      }
      const { data, error } = await supabase.from('LOGIN').select('designation').eq('user_id', cookie_user_id).single();
      if (error) {
        navigate('/');
      }
      navigate(`/${data['designation']}`);
    };

    fetchData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      const { data: userData, error: fetchError } = await supabase
        .from('LOGIN')
        .select('*')
        .eq('email', trimmedEmail);

      console.log('User Data:', userData);
      console.log('Fetch Error:', fetchError);

      if (!userData || userData.length === 0) {
        // No user found
        setError('No user found with this email.');
        return;
      }

      if (userData.length > 1) {
        // Multiple users found
        setError('Multiple accounts found with this email. Please contact support.');
        return;
      }

      const user = userData[0];
      if (user.password === trimmedPassword) {
        Cookies.set('cookie_user_id', user.user_id);

        if (user) {
          if ( user.designation == "faculty" ) {
            navigate('/faculty')
          }
          else if ( user.designation == "student" ) {
            navigate('/student')
          }
          else if ( user.designation == "hod" ) {
            navigate("/hod")
          }
        } else {
          setError('User role is not recognized.');
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate('/forgot');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className='col-span-1'></div>
        <div className="col-span-2 mx-auto p-12 bg-white rounded-xl shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black-1200 px-10">KUMARAGURU COLLEGE OF TECHNOLOGY</h1>
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
                type="text" // Set type to text for email input
                id="email"
                className="w-full px-2 py-2 mt-1 text-xs border rounded focus:outline-none focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                title="Please enter a valid email address"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="block text-lg font text-black-800">
                Password
              </label>
              <div className="relative">
                <input
                  type="text" // Change to text for password input
                  id="password"
                  className="w-full px-3 py-2 mt-1 text-xs border rounded focus:outline-none focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  title="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-indigo-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  );
}
