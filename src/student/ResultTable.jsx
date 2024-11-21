import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoaderDesign from "../common/Loader";

const ResultTable = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetchResultData();
    }
  }, [userInfo]);

  const fetchUserData = async () => {
    try {
      const userId = Cookies.get("cookie_user_id");
      if (!userId) {
        toast.error("User session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("LOGIN")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !userData) {
        console.error("Error fetching user data:", error?.message);
        toast.error("Failed to verify user session. Please log in again.");
        navigate("/");
        return;
      }

      setUserInfo({
        email: userData.email,
        user_id: userData.user_id,
        designation: userData.designation,
        active: userData.active,
      });
    } catch (err) {
      console.error("Error in fetchUserData:", err.message);
      toast.error("Session verification failed. Please log in again.");
      navigate("/login");
    }
  };

  const fetchResultData = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("RESULTS")
        .select(
          `
            *,
            QATABLE (
              exam_name,
              course_id
            )
          `
        )
        .eq("email_id", userInfo?.email);

      if (supabaseError) {
        console.error("Supabase error:", supabaseError.message);
        setError("Failed to fetch results. Please try again later.");
        return;
      }

      setResults(data || []);
    } catch (err) {
      console.error("Error in fetchResultData:", err.message);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoaderDesign/>
    );
  }

  return (
    <div className="w-full p-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {results.length === 0 && !error ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-700">No Results Found</h3>
          <p className="text-gray-500 mt-2">No test results are available at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => {
                const examInfo = result?.QATABLE || {};
                return (
                  <tr
                    key={`${result.question_paper_id}-${result.user_id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {examInfo.exam_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {examInfo.course_id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          result.result?.toLowerCase() === "pass"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {result.result || "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
