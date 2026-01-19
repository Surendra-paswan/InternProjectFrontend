// Nepal Academic Data

export interface ProgramData {
  [key: string]: string[]; // faculty -> programs
}

export const faculties = [
  'Science',
  'Management',
  'Humanities',
  'Law',
  'Engineering',
  'Medicine',
  'Agriculture'
];

export const programsByFaculty: ProgramData = {
  'Science': ['PCM (Physics, Chemistry, Math)', 'PCB (Physics, Chemistry, Biology)', 'Chemistry', 'Physics', 'Biology', 'Mathematics', 'Geology'],
  'Management': ['Accounting', 'Management', 'Economics', 'Business Administration', 'Hotel Management', 'Tourism Management'],
  'Humanities': ['English', 'Nepali', 'History', 'Geography', 'Philosophy', 'Sociology', 'Political Science'],
  'Law': ['Bachelor of Law', 'Master of Law'],
  'Engineering': ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Chemical Engineering'],
  'Medicine': ['MBBS', 'BDS', 'Bachelor of Nursing'],
  'Agriculture': ['Agriculture', 'Forestry', 'Horticulture']
};

export const courseLevels = [
  '+2',
  'Diploma',
  'Bachelor',
  'Master',
  'PhD'
];

export const academicYears = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  '6th Year'
];

export const semestersClasses = [
  'First Semester',
  'Second Semester',
  'First Trimester',
  'Second Trimester',
  'Third Trimester',
  'Class 11',
  'Class 12'
];

export const sections = ['A', 'B', 'C', 'D', 'E'];

export const qualifications = [
  'SLC/SEE (Secondary Education Examination)',
  '+2/Intermediate',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD'
];

export const academicStatuses = [
  'Active',
  'On Hold',
  'Completed',
  'Dropped Out'
];

export const getProgramsForFaculty = (faculty: string): string[] => {
  return programsByFaculty[faculty] || [];
};
