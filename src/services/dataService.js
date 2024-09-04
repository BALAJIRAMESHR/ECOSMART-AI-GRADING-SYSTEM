import { supabase } from '../supabaseClient';

// Fetch all staff names
export const fetchStaffNames = async () => {
  const { data, error } = await supabase
    .from('FACULTYLOGIN')  // Ensure this table name is correct
    .select('name');

  if (error) {
    console.error('Error fetching staff names:', error);
    return [];
  }
  return data.map(staff => staff.name);
};

// Helper function to determine if a semester key is odd or even
const isOddSemester = (key) => parseInt(key) % 2 !== 0;

// Fetch courses based on the selected semester and parse the JSON data
export const fetchCourses = async (semesterType) => {
  // Replace 'public.STUDENTENROLLMENT' with the correct schema and table name if necessary
  const { data, error } = await supabase
    .from('STUDENTENROLL')  // Remove schema prefix if table is in 'public' schema
    .select('sem');

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  // Process the data into the desired format
  const coursesBySemester = data.reduce((acc, entry) => {
    const semData = entry.sem;

    if (typeof semData !== 'object') {
      console.error('Unexpected format for semData:', semData);
      return acc;
    }

    Object.entries(semData).forEach(([key, value]) => {
      if (semesterType === 'Odd' ? isOddSemester(key) : !isOddSemester(key)) {
        if (!acc[key]) {
          acc[key] = { courses: [] };
        }
        acc[key].courses.push(...(value.courses || []));
      }
    });

    return acc;
  }, {});

  // Flatten the coursesBySemester object into an array of courses
  return Object.values(coursesBySemester).flatMap(semester => semester.courses);
};
