import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Simple Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-6">{children}</div>;

const HodCourseMapping = () => {
  const [semester, setSemester] = useState('Odd');
  const [staffNames, setStaffNames] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [assignedCourses, setAssignedCourses] = useState([]);

  // Fetch staff names from FACULTY table
  useEffect(() => {
    const fetchStaffNames = async () => {
      try {
        const { data, error } = await supabase
          .from('FACULTY')
          .select('fid, faculty_name')
          .order('faculty_name');

        if (error) throw error;
        setStaffNames(data || []);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error loading staff names.' });
      }
    };

    fetchStaffNames();
  }, []);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('COURSE')
          .select('course_code, course_name')
          .order('course_code');

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error loading courses.' });
      }
    };

    fetchCourses();
  }, []);

  // Fetch assigned courses for the selected staff and semester
  useEffect(() => {
    const fetchAssignedCourses = async () => {
      if (!selectedStaff) {
        setAssignedCourses([]);
        return;
      }

      try {
        const { data: mappingData, error } = await supabase
          .from('COURSEMAPPING')
          .select('course_id')
          .eq('fid', selectedStaff)
          .eq('select_semester', semester);

        if (error) throw error;
        setAssignedCourses(mappingData?.map((item) => item.course_id) || []);
      } catch (error) {
        console.error('Error fetching assigned courses:', error);
      }
    };

    fetchAssignedCourses();
  }, [selectedStaff, semester]);

  const handleSubmit = async () => {
    if (!selectedStaff || !selectedCourse) {
      setMessage({ type: 'error', text: 'Please select both staff and course.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Check if the course is already assigned
      if (assignedCourses.includes(selectedCourse)) {
        setMessage({ type: 'error', text: 'This course is already assigned to the selected faculty.' });
        return;
      }

      const newMapping = {
        fid: selectedStaff,
        course_id: selectedCourse,
        select_semester: semester,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('COURSEMAPPING').insert(newMapping);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Course successfully assigned!' });
      setAssignedCourses([...assignedCourses, selectedCourse]);
    } catch (error) {
      console.error('Error assigning course:', error);
      setMessage({ type: 'error', text: 'Failed to assign the course.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-800">Faculty Course Mapping</h1>
        </CardHeader>
        <CardContent>
          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Semester Selection */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Odd">Odd Semester</option>
                <option value="Even">Even Semester</option>
              </select>
            </div>

            {/* Staff Selection */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Faculty</label>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a faculty member</option>
                {staffNames.map((staff) => (
                  <option key={staff.fid} value={staff.fid}>
                    {staff.faculty_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a course</option>
                {courses.map((course) => (
                  <option key={course.course_code} value={course.course_code}>
                    {course.course_code} - {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Assigning...' : 'Assign Course'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HodCourseMapping;
