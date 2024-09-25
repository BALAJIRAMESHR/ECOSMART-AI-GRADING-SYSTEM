import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const trimmedEmail = email.trim().toLowerCase();

      // Here you can implement logic to handle password reset
      // For example, sending a password reset link via Supabase Auth
      const { error } = await supabase.auth.api
        .resetPasswordForEmail(trimmedEmail);

      if (error) {
        setError('Error sending password reset email. Please try again.');
      } else {
        setMessage('Password reset email has been sent.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">Forgot Password</h1>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 border border-green-200 rounded p-2">
            {message}
          </div>
        )}
        <form onSubmit={handleForgotPassword}>
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
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
