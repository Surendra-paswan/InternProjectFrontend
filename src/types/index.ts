// Form types for Student Enrollment

export interface PersonalDetails {
  profileImage?: File;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  nationality: string;
  citizenshipNumber: string;
  citizenshipIssueDate: string;
  citizenshipIssueDistrict: string;
  email: string;
  alternateEmail?: string;
  primaryMobile: string;
  secondaryMobile?: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;
  gender: string;
  bloodGroup?: string;
  maritalStatus?: string;
  religion?: string;
  ethnicity: string;
  disabilityStatus: string;
  disabilityType?: string;
  disabilityPercentage?: number;
}

export interface AddressDetails {
  permanent: {
    province: string;
    district: string;
    municipality: string;
    wardNumber: string;
    toleStreet: string;
    houseNumber?: string;
  };
  temporary?: {
    sameAsPermanent: boolean;
    province?: string;
    district?: string;
    municipality?: string;
    wardNumber?: string;
    toleStreet?: string;
    houseNumber?: string;
  };
}

export interface LegalGuardian {
  id: string;
  fullName: string;
  relation: string;
  occupation?: string;
  mobileNumber: string;
  email?: string;
}

export interface ParentGuardianDetails {
  father: {
    fullName: string;
    occupation?: string;
    designation?: string;
    organization?: string;
    mobileNumber: string;
    email?: string;
  };
  mother: {
    fullName: string;
    occupation?: string;
    designation?: string;
    organization?: string;
    mobileNumber: string;
    email?: string;
  };
  legalGuardians: LegalGuardian[];
  annualFamilyIncome?: string;
}

export interface AcademicQualification {
  qualification: string;
  boardUniversity: string;
  institutionName: string;
  passedYear: string;
  divisionGPA: string;
  marksheet?: File;
}

export interface AcademicDetails {
  currentEnrollment: {
    faculty: string;
    program: string;
    courseLevel: string;
    academicYear: string;
    semesterClass: string;
    section: string;
    rollNumber: string;
    registrationNumber: string;
    enrollDate: string;
    academicStatus: string;
  };
  previousHistory: AcademicQualification[];
  citizenshipFrontUpload: File;
  citizenshipBackUpload: File;
  signatureUpload: File;
  characterCertificateUpload?: File;
}

export interface FinancialDetails {
  feeCategory: string;
  scholarshipDetails?: {
    scholarshipType: string;
    scholarshipProviderName: string;
    scholarshipAmount: number;
  };
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    branch: string;
  };
}

export interface Award {
  title: string;
  issuingOrganization: string;
  yearReceived: string;
}

export interface ExtracurricularDetails {
  interests: string[];
  otherInterestDetails?: string;
  previousAwards: Award[];
  hostellerStatus: string;
  transportationMethod: string;
}

export interface Declaration {
  agreedToTerms: boolean;
  dateOfApplication: string;
  place: string;
}

export interface StudentEnrollmentForm {
  personalDetails: PersonalDetails;
  addressDetails: AddressDetails;
  parentGuardianDetails: ParentGuardianDetails;
  academicDetails: AcademicDetails;
  financialDetails: FinancialDetails;
  extracurricularDetails: ExtracurricularDetails;
  declaration: Declaration;
}
