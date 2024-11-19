import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck, AlertCircle, Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.api.resetPasswordForEmail(trimmedEmail);

      if (error) {
        setError("Error sending password reset email. Please try again.");
      } else {
        setMessage("Password reset email has been sent.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden px-4 sm:px-6">
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float absolute top-1/4 left-12 text-emerald-500 opacity-20">
          <Mail size={64} strokeWidth={1.5} />
        </div>
        <div className="animate-float-delayed absolute top-1/2 right-16 text-emerald-500 opacity-20">
          <ShieldCheck size={72} strokeWidth={1.5} />
        </div>
        <div className="animate-float absolute bottom-12 right-32 text-emerald-500 opacity-20">
          <AlertCircle size={60} strokeWidth={1.5} />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="mx-auto p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
          {/* ECO SMART AI Grading System Header */}
          <div className="text-center space-y-4 mb-6">
            <div className="space-y-2 animate-fade-in">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-lg shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">
                  ECO SMART
                </h1>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">
                  AI GRADING SYSTEM
                </h1>
              </div>
            </div>

            {/* Kumaraguru College of Technology */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center p-2 shadow-lg transition-transform hover:scale-105">
                <Key className="text-white w-8 h-8" />
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                Forgot password
              </h2>
              <p className="text-sm text-gray-600">
              Enter your email to receive reset instructions.
            </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded p-3 animate-shake">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 text-sm text-green-600 bg-green-100 border border-green-200 rounded p-3 animate-fade-in">
              {message}
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Sending..." : <><Key size={16} /> Submit</>}
            </button>
          </form>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-600 rounded-lg py-2 px-4 text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </div>

      {/* Styling Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
