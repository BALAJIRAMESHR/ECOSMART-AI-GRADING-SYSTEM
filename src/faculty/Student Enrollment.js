// src/pages/StudentEnrollment.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const StudentEnrollment = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedYear) {
      setMessage('Please select a year.');
      return;
    }

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const allowedTypes = ['application/pdf', 
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                          'application/vnd.ms-excel'];

    if (!allowedTypes.includes(file.type)) {
      setMessage('Only PDF and Excel files are allowed.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedYear}/${Date.now()}_${file.name}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      let { error: uploadError } = await supabase.storage
        .from('student-enrollments')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL (if bucket is public) or signed URL (for private)
      const { data: fileData, error: urlError } = await supabase.storage
        .from('student-enrollments')
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      const fileURL = fileData.publicURL;

      // Insert metadata into the database
      const { error: insertError } = await supabase
        .from('STUDENT_ENROLLMENTS')
        .insert([
          { year: selectedYear, file_url: fileURL },
        ]);

      if (insertError) {
        throw insertError;
      }

      setMessage('File uploaded successfully!');
      setSelectedYear('');
      setFile(null);
      // Reset the file input
      document.getElementById('file-input').value = '';
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold mb-6">Student Enrollment</h1>

      {message && (
        <div className={`mb-4 p-2 rounded ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpload}>
        {/* Year Selection */}
        <div className="mb-4">
          <label htmlFor="year" className="block mb-2 text-lg font-medium">
            Select Year:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Year --</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label htmlFor="file" className="block mb-2 text-lg font-medium">
            Upload File (PDF or Excel):
          </label>
          <input
            type="file"
            id="file-input"
            accept=".pdf, .xlsx, .xls"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-3 text-white rounded ${uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default StudentEnrollment;
