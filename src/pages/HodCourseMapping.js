import React, { useState, useEffect } from 'react';
import { fetchStaffNames, fetchCourses } from '../services/dataService';
import { supabase } from '../supabaseClient';

const HodCourseMapping = () => {
  const [semester, setSemester] = useState('Odd');
  const [staffNames, setStaffNames] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    // Fetch staff names once on component mount
    fetchStaffNames().then(setStaffNames);
  }, []);

  useEffect(() => {
    // Fetch courses when the semester type changes
    fetchCourses(semester).then(setCourses);
  }, [semester]);

  // Handle the form submission
const handleSubmit = async () => {
  if (!selectedStaff || !selectedCourse) {
    alert('Please select both staff and course.');
    return;
  }

  try {
    // Fetch the faculty ID based on the selected staff name
    const { data: facultyData, error: facultyError } = await supabase
      .from('FACULTYLOGIN')
      .select('fid')
      .eq('name', selectedStaff)
      .single();

    if (facultyError || !facultyData) {
      console.error('Error finding faculty ID:', facultyError);
      return;
    }

    const facultyId = facultyData.id;

    // Determine the semester column to update
    const yearColumn = semester === 'Odd' ? 'year_odd' : 'year_even';
    const newMapping = { sem_id: 1, coursecode: selectedCourse };

    // Fetch existing course mapping data for the faculty
    const { data: existingData, error: fetchError } = await supabase
      .from('COURSEMAPPING')
      .select('fid, year_odd, year_even')
      .eq('fid', facultyId)
      .single();

    if (fetchError) {
      console.error('Error fetching existing course mapping:', fetchError);
      return;
    }
    

    let updatedMapping;
    if (existingData) {
      // Update the existing record
      updatedMapping = { ...existingData };

      // Parse existing data for the relevant year column
      const existingColumnData = existingData[yearColumn] ? JSON.parse(existingData[yearColumn]) : [];
      // Add the new mapping to the existing data
      updatedMapping[yearColumn] = JSON.stringify([...existingColumnData, newMapping]);
    } else {
      // Create a new record
      updatedMapping = {
        fid: facultyId,
        [yearColumn]: JSON.stringify([newMapping]),
      };
    }

    // Ensure all fields are defined and correctly formatted
       console.log('Updated Mapping:', updatedMapping);
       console.log('Faculty ID:', facultyId);

    // Upsert the updated or new mapping
    const { error: insertError } = await supabase
      .from('COURSEMAPPING')
      .upsert(updatedMapping);

    if (insertError) {
      console.error('Error inserting course mapping:', insertError);
      console.error('Error details:', insertError.message);
    } else {
      alert('Course mapping added successfully!');
      // Reset selections after successful submission
      setSelectedStaff('');
      setSelectedCourse('');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};


  return (
    <div className="p-4 flex-grow">
      <h2 className="text-xl font-bold mb-4">Course Mapping</h2>

      {/* Semester Selection */}
      <div className="mb-4">
        <label className="mr-4">Select Semester:</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Odd">Odd Sem</option>
          <option value="Even">Even Sem</option>
        </select>
      </div>

      {/* Staff Selection */}
      <div className="mb-4">
        <label className="mr-4">Select Staff:</label>
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Staff</option>
          {staffNames.map((staff, index) => (
            <option key={index} value={staff}>
              {staff}
            </option>
          ))}
        </select>
      </div>

      {/* Course Selection */}
      <div className="mb-4">
        <label className="mr-4">Select Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Course</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default HodCourseMapping;
