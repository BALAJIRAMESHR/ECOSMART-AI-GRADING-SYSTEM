import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Cookies from 'js-cookie';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Leaf, TreeDeciduous, GraduationCap, BookOpen, School, Brain, Sprout } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const cookie_user_id = Cookies.get('cookie_user_id');
      if (!cookie_user_id) return;
      const { data, error } = await supabase.from('LOGIN').select('designation').eq('user_id', cookie_user_id).single();
      if (error) navigate('/');
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

      if (!userData || userData.length === 0) {
        setError('No user found with this email.');
        return;
      }
      if (userData.length > 1) {
        setError('Multiple accounts found with this email. Please contact support.');
        return;
      }
      const user = userData[0];
      if (user.password === trimmedPassword) {
        Cookies.set('cookie_user_id', user.user_id);
        if (user) {
          if (user.designation === "faculty") navigate('/faculty')
          else if (user.designation === "student") navigate('/student')
          else if (user.designation === "hod") navigate("/hod")
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleForgotPassword = () => navigate('/forgot');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden px-4 sm:px-6">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          @keyframes floatDelayed {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-8px) rotate(-5deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            75% { transform: translateX(3px); }
          }
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          .float-animation-delayed {
            animation: floatDelayed 8s ease-in-out infinite;
          }
          .fade-in-animation {
            animation: fadeIn 0.8s ease-out;
          }
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
          .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
        `}
      </style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="float-animation absolute top-1/4 left-12 text-emerald-500 opacity-20">
          <Leaf size={69} strokeWidth={1.5} />
        </div>
        <div className="float-animation-delayed absolute top-1/3 right-8 text-emerald-500 opacity-20">
          <TreeDeciduous size={60} strokeWidth={1.5} />
        </div>
        <div className="float-animation absolute bottom-1/4 left-12 text-emerald-500 opacity-20">
          <BookOpen size={64} strokeWidth={1.5} />
        </div>
        <div className="float-animation-delayed absolute top-1/2 left-1/4 text-emerald-500 opacity-20">
          <GraduationCap size={68} strokeWidth={1.5} />
        </div>
        <div className="float-animation absolute bottom-1/3 right-1/4 text-emerald-500 opacity-20">
          <BookOpen size={64} strokeWidth={1.5} />
        </div>
        <div className="float-animation-delayed absolute top-48 left-1/2 transform -translate-x-1/2 text-emerald-500 opacity-20">
          <Brain size={60} strokeWidth={1.5} />
        </div>
        <div className="float-animation absolute bottom-12 right-24 text-emerald-500 opacity-20">
          <Sprout size={64} strokeWidth={1.5} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="mx-auto p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
          <div className="text-center space-y-4 mb-6">
            <div className="space-y-2 fade-in-animation">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white tracking-wide leading-tight mb-1">
                  ECO SMART
                </h1>
                <h1 className="text-3xl font-bold text-white tracking-wide leading-tight">
                  AI GRADING SYSTEM
                </h1>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center p-2 shadow-lg transition-transform hover:scale-105">
                <School className="text-white w-8 h-8" />
              </div>
              <h2 className="text-base font-semibold text-gray-800">
                KUMARAGURU COLLEGE OF TECHNOLOGY
              </h2>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 shake-animation">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? <AiOutlineEye size={16} /> : <AiOutlineEyeInvisible size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : 'Login'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;