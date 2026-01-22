// API Service for Student Enrollment - Exact Backend Structure Format

import axios from "axios";

// Use /api proxy in development, full URL in production
const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'https://localhost:7257/api');

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Merge two student payloads, preferring non-empty values and fuller arrays
const mergeStudentPayloads = (a: any, b: any): any => {
  const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
  if (!a && !b) return null;
  if (!a) return b;
  if (!b) return a;
  const out: any = { ...a };
  for (const [key, valB] of Object.entries(b)) {
    const valA = out[key];
    if (Array.isArray(valB)) {
      // Prefer the non-empty array
      out[key] = Array.isArray(valA) && valA.length > 0 ? valA : valB;
    } else if (isObj(valB)) {
      out[key] = mergeStudentPayloads(valA, valB);
    } else {
      // Fill empty/undefined with b
      const isEmptyA = valA === undefined || valA === null || (typeof valA === 'string' && valA.trim() === '');
      const hasB = valB !== undefined && valB !== null && !(typeof valB === 'string' && valB.trim() === '');
      out[key] = isEmptyA && hasB ? valB : valA;
    }
  }
  return out;
}

// Transform form data to EXACT backend structure
const transformFormData = (formData: any) => {
  return {
    // Basic Details
    firstName: formData.personalDetails?.firstName || 'Test',
    middleName: formData.personalDetails?.middleName || '',
    lastName: formData.personalDetails?.lastName || 'User',
    dateOfBirth: formData.personalDetails?.dateOfBirth || '2000-01-01T00:00:00Z',
    placeOfBirth: formData.personalDetails?.placeOfBirth || 'Kathmandu',
    photoPath: '',
    gender: parseInt(formData.personalDetails?.gender) || 0,
    nationality: 0,
    bloodGroup: 0,
    maritalStatus: 0,
    religion: formData.personalDetails?.religion || 'Hindu',
    ethnicity: formData.personalDetails?.ethnicity || 'Newari',
    email: formData.personalDetails?.email || 'test@example.com',
    alternateEmail: formData.personalDetails?.alternateEmail || '',
    primaryMobile: formData.personalDetails?.primaryMobile || '9800000000',
    secondaryMobile: formData.personalDetails?.secondaryMobile || '',

    // Financial
    feeCategory: 0,
    scholarshipType: 0,
    scholarshipProviderName: formData.financialDetails?.scholarshipDetails?.providerName || '',
    scholarshipAmount: 0,
    accountHolderName: formData.financialDetails?.bankDetails?.accountHolderName || 'N/A',
    bankName: 0,
    accountNumber: formData.financialDetails?.bankDetails?.accountNumber || '0000000000',
    branch: formData.financialDetails?.bankDetails?.branch || 'Main Branch',

    // Citizenship
    citizenshipNumber: formData.personalDetails?.citizenshipNumber || '12345678',
    issueDate: formData.personalDetails?.citizenshipIssueDate || '2020-01-01T00:00:00Z',
    issueDistrict: formData.personalDetails?.citizenshipIssueDistrict || 'Kathmandu',

    // Academic
    faculty: 0,
    program: 0,
    level: 0,
    academicYear: 2078,
    semester: 0,
    section: 0,
    rollNumber: formData.academicDetails?.currentEnrollment?.rollNumber || '001',
    registrationNumber: formData.academicDetails?.currentEnrollment?.registrationNumber || 'REG001',
    enrollmentDate: formData.academicDetails?.currentEnrollment?.enrollDate || '2024-01-01T00:00:00Z',
    academicStatus: 0,
    isAgreed: true,
    applicationDate: new Date().toISOString(),
    place: formData.declaration?.place || 'Kathmandu',

    // Arrays
    addresses: [
      {
        addressType: 0,
        province: formData.addressDetails?.permanent?.province || 'Bagmati',
        district: formData.addressDetails?.permanent?.district || 'Kathmandu',
        municipality: formData.addressDetails?.permanent?.municipality || 'Kathmandu',
        wardNumber: parseInt(formData.addressDetails?.permanent?.wardNumber) || 1,
        toleStreet: formData.addressDetails?.permanent?.toleStreet || 'Main Street',
        houseNumber: formData.addressDetails?.permanent?.houseNumber || '123'
      },
      {
        addressType: 1,
        province: formData.addressDetails?.temporary?.province || 'Bagmati',
        district: formData.addressDetails?.temporary?.district || 'Kathmandu',
        municipality: formData.addressDetails?.temporary?.municipality || 'Kathmandu',
        wardNumber: parseInt(formData.addressDetails?.temporary?.wardNumber) || 1,
        toleStreet: formData.addressDetails?.temporary?.toleStreet || 'Main Street',
        houseNumber: formData.addressDetails?.temporary?.houseNumber || '123'
      }
    ],

    emergencyContacts: [
      {
        contactName: formData.personalDetails?.emergencyContactName || 'Parent',
        relation: 0,
        contactNumber: formData.personalDetails?.emergencyContactNumber || '9800000001'
      }
    ],

    disabilityDetails: [],

    parentGuardians: [
      {
        parentType: 0,
        fullName: formData.parentGuardianDetails?.father?.fullName || 'Father',
        occupation: formData.parentGuardianDetails?.father?.occupation || 'Business',
        designation: formData.parentGuardianDetails?.father?.designation || '',
        organization: formData.parentGuardianDetails?.father?.organization || '',
        mobileNumber: formData.parentGuardianDetails?.father?.mobileNumber || '9800000002',
        gardianEmail: formData.parentGuardianDetails?.father?.email || 'father@example.com',
        annualFamilyIncome: 0
      },
      {
        parentType: 1,
        fullName: formData.parentGuardianDetails?.mother?.fullName || 'Mother',
        occupation: formData.parentGuardianDetails?.mother?.occupation || 'Housewife',
        designation: formData.parentGuardianDetails?.mother?.designation || '',
        organization: formData.parentGuardianDetails?.mother?.organization || '',
        mobileNumber: formData.parentGuardianDetails?.mother?.mobileNumber || '9800000003',
        gardianEmail: formData.parentGuardianDetails?.mother?.email || 'mother@example.com',
        annualFamilyIncome: 0
      }
    ],

    academicHistories: [],

    extracurricularDetails: [
      {
        interests: '',
        achievements: '',
        scholarType: 0,
        transportMethod: 0
      }
    ],

    documents: []
  };
};

// Submit student enrollment form
export const submitStudentEnrollment = async (formData: any): Promise<ApiResponse<any>> => {
  try {
    console.log("form data request:", formData);
    const studentData = transformFormData(formData);
    
    console.log('📤 Submitting to /api/Student/register');

    const response = await axios.post(`${API_BASE_URL}/Student/register`, studentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: () => true,
    });

    console.log('✅ Status:', response.status);
    console.log('📨 Response:', response.data);

    if (response.status >= 200 && response.status < 300) {
      const studentId = response.data?.data?.id || response.data?.id;
      
      // Upload documents if student was created
      if (studentId && formData.academicDetails) {
        uploadStudentDocuments(studentId, formData);
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Enrollment submitted successfully!',
      };
    } else {
      const errorMessage = response.data?.message || `Error: ${response.status}`;
      return {
        success: false,
        message: errorMessage,
        errors: [errorMessage],
      };
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to submit',
      errors: [error.message],
    };
  }
};

// Upload documents for a student
const uploadStudentDocuments = async (studentId: string, formData: any) => {
  try {
    const formDataObj = new FormData();
    
    if (formData.academicDetails?.citizenshipFrontUpload) {
      formDataObj.append('PhotoFile', formData.academicDetails.citizenshipFrontUpload);
    }
    if (formData.academicDetails?.citizenshipBackUpload) {
      formDataObj.append('CitizenshipFile', formData.academicDetails.citizenshipBackUpload);
    }
    if (formData.academicDetails?.signatureUpload) {
      formDataObj.append('SignatureFile', formData.academicDetails.signatureUpload);
    }
    if (formData.academicDetails?.characterCertificateUpload) {
      formDataObj.append('CharacterCertificateFile', formData.academicDetails.characterCertificateUpload);
    }

    if (formDataObj.entries().next().value) {
      console.log('📤 Uploading documents for student:', studentId);
      
      const response = await axios.post(
        `${API_BASE_URL}/Student/${studentId}/upload-files`,
        formDataObj,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          validateStatus: () => true,
        }
      );

      console.log('✅ Upload status:', response.status);
    }
  } catch (error: any) {
    console.error('Document upload error:', error.message);
  }
};

// Get all students
export const getAllStudents = async (): Promise<ApiResponse<any[]>> => {
  try {
    console.log(`📚 Fetching all students from /Student/all...`);
    const response = await axios.get(`${API_BASE_URL}/Student/all`, {
      validateStatus: () => true,
    });
    console.log(`📊 /Student/all Status: ${response.status}, Data:`, response.data);

    if (response.status >= 200 && response.status < 300) {
      // Unwrap data if nested
      const studentsData = response.data?.data ?? response.data;
      const studentsList = Array.isArray(studentsData) ? studentsData : [];
      console.log(`✓ Retrieved ${studentsList.length} students`);
      return {
        success: true,
        data: studentsList,
      };
    } else {
      console.log(`❌ Failed to fetch students: ${response.status}`);
      return {
        success: false,
        message: 'Failed to fetch students',
        errors: ['Failed to retrieve student list'],
      };
    }
  } catch (error: any) {
    console.error(`❌ getAllStudents error:`, error.message);
    return {
      success: false,
      message: 'Network error',
      errors: [error.message],
    };
  }
};

// Get student by ID (supports numeric ID, UUID, or PID)
export const getStudentById = async (idOrPid: string): Promise<ApiResponse<any>> => {
  try {
    const tryGet = async (url: string) => {
      console.log(`🔗 Fetching: ${url}`);
      const res = await axios.get(url, { validateStatus: () => true });
      console.log(`📊 Status: ${res.status}, Response:`, res.data);
      return res;
    };

    // Attempt both endpoints to obtain the fullest record
    console.log(`🔍 Searching for: ${idOrPid}`);
    const resId = await tryGet(`${API_BASE_URL}/Student/${idOrPid}`);
    const payloadId = resId.status >= 200 && resId.status < 300 ? (resId.data?.data ?? resId.data) : null;
    console.log(`✓ ID payload:`, payloadId);

    const resPid = await tryGet(`${API_BASE_URL}/Student/pid/${idOrPid}`);
    const payloadPid = resPid.status >= 200 && resPid.status < 300 ? (resPid.data?.data ?? resPid.data) : null;
    console.log(`✓ PID payload:`, payloadPid);

    const merged = mergeStudentPayloads(payloadId, payloadPid);
    console.log(`✓ Merged result:`, merged);

    if (merged) {
      return { success: true, data: merged };
    }

    // If both direct lookups failed, try to find by numeric ID in the students list
    console.log(`🔄 Direct lookups failed. Trying numeric ID lookup...`);
    const numericId = parseInt(idOrPid, 10);
    if (!isNaN(numericId)) {
      const studentsRes = await getAllStudents();
      console.log(`📋 getAllStudents result:`, studentsRes);
      if (studentsRes.success && Array.isArray(studentsRes.data)) {
        console.log(`📋 Searching in ${studentsRes.data.length} students for ID: ${numericId}`);
        const found = studentsRes.data.find((s: any) => s.id === numericId);
        console.log(`🔍 Found student:`, found);
        if (found && found.pid) {
          console.log(`✓ Found student by numeric ID ${numericId}, PID: ${found.pid}`);
          // Fetch the full record using the PID directly (not /pid/ route)
          const resFull = await tryGet(`${API_BASE_URL}/Student/${found.pid}`);
          const payloadFull = resFull.status >= 200 && resFull.status < 300 ? (resFull.data?.data ?? resFull.data) : null;
          if (payloadFull) {
            console.log(`✓ Fetched full record for numeric ID ${numericId}:`, payloadFull);
            return { success: true, data: payloadFull };
          } else {
            console.log(`❌ Failed to fetch full record for PID: ${found.pid}`);
          }
        } else {
          console.log(`❌ No student found with numeric ID: ${numericId}`);
        }
      }
    }

    // No successful payloads or numeric ID lookup
    const message = resId.data?.message || resPid.data?.message || 'Failed to fetch student';
    console.log(`❌ Failed: ${message}`);
    return { success: false, message, errors: ['Student not found'] };
  } catch (error: any) {
    console.error(`❌ Network error:`, error.message);
    return { success: false, message: 'Network error', errors: [error.message] };
  }
};

// Update student by ID
export const updateStudentById = async (id: string, data: any): Promise<ApiResponse<any>> => {
  try {
    console.log('🔄 Updating student:', id);
    const response = await axios.put(`${API_BASE_URL}/Student/${id}`, data, {
      validateStatus: () => true,
    });

    console.log('📊 Update response status:', response.status);
    console.log('📊 Update response data:', response.data);

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        message: 'Student updated successfully',
      };
    } else {
      // Extract validation errors if present
      const validationErrors = response.data?.errors || {};
      const errorMessages = Object.entries(validationErrors).map(([field, msgs]: [string, any]) => 
        `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
      );
      
      return {
        success: false,
        message: response.data?.message || response.data?.title || 'Failed to update student',
        errors: errorMessages.length > 0 ? errorMessages : [response.data?.message || 'Update failed'],
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error',
      errors: [error.message],
    };
  }
};

// Partially update student by ID using HTTP PATCH
export const updateStudentPartial = async (id: string, changes: any): Promise<ApiResponse<any>> => {
  try {
    console.log('🔄 Partially updating student:', id);
    const response = await axios.patch(`${API_BASE_URL}/Student/${id}`, changes, {
      validateStatus: () => true,
    });

    console.log('📊 PATCH response status:', response.status);
    console.log('📊 PATCH response data:', response.data);

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        message: 'Student updated successfully',
      };
    } else {
      const errors =
        (response.data?.errors && Array.isArray(response.data.errors)
          ? response.data.errors
          : typeof response.data?.errors === 'object'
          ? Object.values(response.data.errors).flatMap((v: any) => (Array.isArray(v) ? v : [String(v)]))
          : []) || [];
      return {
        success: false,
        message: response.data?.message || 'Failed to update student',
        errors,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error',
      errors: [error.message],
    };
  }
};

// Delete student by ID
export const deleteStudentById = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Student/${id}`, {
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Student deleted successfully',
      };
    } else {
      return {
        success: false,
        message: 'Failed to delete student',
        errors: ['Delete failed'],
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error',
      errors: [error.message],
    };
  }
};

