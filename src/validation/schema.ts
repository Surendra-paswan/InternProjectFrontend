import { z } from 'zod';

// Personal Details Schema
export const PersonalDetailsSchema = z.object({
  firstName: z.string().optional().default('').refine(val => val.length > 0, 'First name is required'),
  middleName: z.string().optional().default(''),
  lastName: z.string().optional().default('').refine(val => val.length > 0, 'Last name is required'),
  email: z.string().optional().default('').refine(val => val.length > 0, 'Email is required').refine(val => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Invalid email address'),
  phoneNumber: z.string().optional().default('').refine(val => val === '' || /^\d{10}$/.test(val), 'Phone number must be 10 digits'),
  primaryMobile: z.string().optional().default('').refine(val => val.length > 0, 'Primary mobile is required').refine(val => val === '' || /^\d{10}$/.test(val), 'Primary mobile must be 10 digits'),
  secondaryMobile: z.string().optional().default(''),
  alternateEmail: z.string().optional().default(''),
  citizenship: z.string().optional().default(''),
  citizenshipNumber: z.string().optional().default('').refine(val => val.length > 0, 'Citizenship number is required'),
  citizenshipIssueDate: z.string().optional().default('').refine(val => val.length > 0, 'Citizenship issue date is required'),
  citizenshipIssueDistrict: z.string().optional().default('').refine(val => val.length > 0, 'Citizenship issue district is required'),
  dateOfBirth: z.string().optional().default('').refine(val => val.length > 0, 'Date of birth is required'),
  nationality: z.string().optional().default('').refine(val => val.length > 0, 'Nationality is required'),
  placeOfBirth: z.string().optional().default('').refine(val => val.length > 0, 'Place of birth is required'),
  gender: z.string().optional().default('').refine(val => val.length > 0, 'Gender is required'),
  ethnicity: z.string().optional().default('').refine(val => val.length > 0, 'Ethnicity is required'),
  religion: z.string().optional().default('').refine(val => val.length > 0, 'Religion is required'),
  bloodGroup: z.string().optional().nullable().default(''),
  disability: z.boolean().optional(),
  disabilityType: z.string().optional().nullable().default(''),
  disabilityPercentage: z.string().optional().nullable().default(''),
  profileImage: z.instanceof(File).refine(val => val !== null && val !== undefined, 'Profile photo is required'),
  emergencyContactName: z.string().optional().default('').refine(val => val.length > 0, 'Emergency contact name is required'),
  emergencyContactNumber: z.string().optional().default('').refine(val => val.length > 0, 'Emergency contact number is required').refine(val => val === '' || /^\d{10}$/.test(val), 'Emergency contact number must be 10 digits'),
  emergencyContactRelation: z.string().optional().default('').refine(val => val.length > 0, 'Emergency contact relation is required'),
}).passthrough();

// Address Details Schema
export const AddressDetailsSchema = z.object({
  permanent: z.object({
    province: z.string().optional().default('').refine(val => val.length > 0, 'Province is required'),
    district: z.string().optional().default('').refine(val => val.length > 0, 'District is required'),
    municipality: z.string().optional().default('').refine(val => val.length > 0, 'Municipality/VDC is required'),
    wardNumber: z.string().optional().default('').refine(val => val.length > 0, 'Ward number is required'),
    toleStreet: z.string().optional().default('').refine(val => val.length > 0, 'Tole/Street is required'),
    houseNumber: z.string().optional().default(''),
  }).passthrough(),
  isSameAsPermanent: z.boolean().optional(),
  temporary: z.object({
    province: z.string().optional().default('').refine(val => val.length > 0, 'Province is required'),
    district: z.string().optional().default('').refine(val => val.length > 0, 'District is required'),
    municipality: z.string().optional().default('').refine(val => val.length > 0, 'Municipality/VDC is required'),
    wardNumber: z.string().optional().default('').refine(val => val.length > 0, 'Ward number is required'),
    toleStreet: z.string().optional().default('').refine(val => val.length > 0, 'Tole/Street is required'),
    houseNumber: z.string().optional().default(''),
    sameAsPermanent: z.boolean().optional(),
  }).passthrough(),
}).passthrough();

// Parent Guardian Schema
export const GuardianDetailsSchema = z.object({
  father: z.object({
    fullName: z.string().optional().default('').refine(val => val.length > 0, 'Father name is required'),
    occupation: z.string().optional().default('').refine(val => val.length > 0, 'Father occupation is required'),
    designation: z.string().optional().default(''),
    organization: z.string().optional().default(''),
    mobileNumber: z.string().optional().default('').refine(val => val.length > 0, 'Father mobile number is required').refine(val => val === '' || /^\d{10}$/.test(val), 'Father mobile must be 10 digits'),
    email: z.string().optional().default(''),
  }).passthrough(),
  mother: z.object({
    fullName: z.string().optional().default('').refine(val => val.length > 0, 'Mother name is required'),
    occupation: z.string().optional().default('').refine(val => val.length > 0, 'Mother occupation is required'),
    designation: z.string().optional().default(''),
    organization: z.string().optional().default(''),
    mobileNumber: z.string().optional().default('').refine(val => val.length > 0, 'Mother mobile number is required').refine(val => val === '' || /^\d{10}$/.test(val), 'Mother mobile must be 10 digits'),
    email: z.string().optional().default(''),
  }).passthrough(),
  legalGuardians: z.array(z.object({
    id: z.string().optional(),
    fullName: z.string().optional().default('').refine(val => val.length > 0, 'Guardian full name is required'),
    relation: z.string().optional().default('').refine(val => val.length > 0, 'Guardian relation is required'),
    occupation: z.string().optional().default(''),
    mobileNumber: z.string().optional().default('').refine(val => val.length > 0, 'Guardian mobile number is required').refine(val => val === '' || /^\d{10}$/.test(val), 'Guardian mobile must be 10 digits'),
    email: z.string().optional().default(''),
  }).passthrough()).optional(),
  annualFamilyIncome: z.string().optional().default(''),
}).passthrough();

// Previous Qualification Schema
export const QualificationSchema = z.object({
  qualification: z.string().optional().default('').refine(val => val.length > 0, 'Qualification is required'),
  boardUniversity: z.string().optional().default('').refine(val => val.length > 0, 'Board/University is required'),
  institutionName: z.string().optional().default('').refine(val => val.length > 0, 'Institution name is required'),
  passedYear: z.string().optional().default('').refine(val => val.length > 0, 'Passed year is required'),
  divisionGPA: z.string().optional().default('').refine(val => val.length > 0, 'Division/GPA is required'),
}).passthrough();

// Academic Details Schema
export const AcademicDetailsSchema = z.object({
  currentEnrollment: z.object({
    faculty: z.string().optional().default('').refine(val => val.length > 0, 'Faculty is required'),
    program: z.string().optional().default('').refine(val => val.length > 0, 'Program is required'),
    academicYear: z.string().optional().default('').refine(val => val.length > 0, 'Academic year is required'),
    semesterClass: z.string().optional().default('').refine(val => val.length > 0, 'Semester is required'),
    courseLevel: z.string().optional().default('').refine(val => val.length > 0, 'Course level is required'),
    section: z.string().optional().default('').refine(val => val.length > 0, 'Section is required'),
    rollNumber: z.string().optional().default('').refine(val => val.length > 0, 'Roll number is required'),
    registrationNumber: z.string().optional().default('').refine(val => val.length > 0, 'Registration number is required'),
    enrollDate: z.string().optional().default('').refine(val => val.length > 0, 'Enroll date is required'),
    academicStatus: z.string().optional().default(''),
  }).passthrough(),
  previousHistory: z.array(QualificationSchema).optional(),
  citizenshipFrontUpload: z.instanceof(File).refine(val => val !== null && val !== undefined, 'Citizenship copy front is required'),
  citizenshipBackUpload: z.instanceof(File).refine(val => val !== null && val !== undefined, 'Citizenship copy back is required'),
  signatureUpload: z.instanceof(File).refine(val => val !== null && val !== undefined, 'Signature upload is required'),
  characterCertificateUpload: z.instanceof(File).optional().nullable(),
}).passthrough();

// Financial Details Schema
export const FinancialDetailsSchema = z.object({
  feeCategory: z.string().optional().default('').refine(val => val.length > 0, 'Fee category is required'),
  scholarshipDetails: z.object({
    scholarshipType: z.string().optional().default('').refine(val => val.length > 0, 'Scholarship type is required'),
    scholarshipProviderName: z.string().optional().default('').refine(val => val.length > 0, 'Scholarship provider name is required'),
    scholarshipAmount: z.string().optional().default('').refine(val => val.length > 0, 'Scholarship amount is required'),
  }).passthrough().optional(),
  bankDetails: z.object({
    accountHolderName: z.string().optional().default('').refine(val => val.length > 0, 'Account holder name is required'),
    bankName: z.string().optional().default('').refine(val => val.length > 0, 'Bank name is required'),
    accountNumber: z.string().optional().default('').refine(val => val.length > 0, 'Account number is required'),
    branch: z.string().optional().default('').refine(val => val.length > 0, 'Branch is required'),
  }).passthrough().optional(),
}).passthrough().refine((data) => {
  // If fee category is "Scholarship", scholarshipDetails must be provided
  if (data.feeCategory === 'Scholarship') {
    return data.scholarshipDetails && 
           data.scholarshipDetails.scholarshipType &&
           data.scholarshipDetails.scholarshipProviderName &&
           data.scholarshipDetails.scholarshipAmount;
  }
  return true;
}, {
  message: 'Scholarship details are required when fee category is Scholarship',
  path: ['scholarshipDetails'],
});

// Award Schema
export const AwardSchema = z.object({
  title: z.string().optional().default('').refine(val => val.length > 0, 'Award title is required'),
  issuingOrganization: z.string().optional().default('').refine(val => val.length > 0, 'Issuing organization is required'),
  yearReceived: z.string().optional().default('').refine(val => val.length > 0, 'Year received is required'),
}).passthrough();

// Extracurricular Details Schema
export const ExtracurricularDetailsSchema = z.object({
  interests: z.array(z.string()).optional().default([]).refine(val => val.length > 0, 'Select at least one interest'),
  otherInterestDetails: z.string().optional().default(''),
  previousAwards: z.array(AwardSchema).optional(),
  hostellerStatus: z.string().optional().default('').refine(val => val.length > 0, 'Hosteller status is required'),
  transportationMethod: z.string().optional().default('').refine(val => val.length > 0, 'Transportation method is required'),
}).passthrough().refine((data) => {
  // Only require otherInterestDetails if "Other" is selected in interests
  if (data.interests?.includes('Other') && data.otherInterestDetails?.length === 0) {
    return false;
  }
  return true;
}, {
  message: 'Please specify other interest',
  path: ['otherInterestDetails'],
});

// Declaration Schema
export const DeclarationSchema = z.object({
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  dateOfApplication: z.string().optional().default('').refine(val => val.length > 0, 'Date of application is required'),
  place: z.string().optional().default('').refine(val => val.length > 0, 'Place is required'),
}).passthrough();

// Complete Form Schema
export const EnrollmentFormSchema = z.object({
  personal: PersonalDetailsSchema,
  address: AddressDetailsSchema,
  guardian: GuardianDetailsSchema,
  academic: AcademicDetailsSchema,
  financial: FinancialDetailsSchema,
  extracurricular: ExtracurricularDetailsSchema,
  declaration: DeclarationSchema,
});

export type PersonalDetails = z.infer<typeof PersonalDetailsSchema>;
export type AddressDetails = z.infer<typeof AddressDetailsSchema>;
export type GuardianDetails = z.infer<typeof GuardianDetailsSchema>;
export type Qualification = z.infer<typeof QualificationSchema>;
export type AcademicDetails = z.infer<typeof AcademicDetailsSchema>;
export type FinancialDetails = z.infer<typeof FinancialDetailsSchema>;
export type Award = z.infer<typeof AwardSchema>;
export type ExtracurricularDetails = z.infer<typeof ExtracurricularDetailsSchema>;
export type Declaration = z.infer<typeof DeclarationSchema>;
export type EnrollmentForm = z.infer<typeof EnrollmentFormSchema>;
