import { useState } from 'react';
import type { StudentEnrollmentForm, PersonalDetails, AddressDetails, ParentGuardianDetails, AcademicDetails } from '../types';
import { EnrollmentFormSchema } from '../validation/schema';
import { formatZodErrors, type ValidationError } from '../validation/utils';
import { submitStudentEnrollment } from '../services/api';
import '../styles/form.css';
import '../styles/formFields.css';
import '../styles/addressFields.css';
import '../styles/parentGuardianFields.css';
import '../styles/academicFields.css';
import '../styles/extracurricularFields.css';
import '../styles/declarationFields.css';
import PersonalDetailsSection from './FormSections/PersonalDetailsSection';
import AddressDetailsSection from './FormSections/AddressDetailsSection';
import ParentGuardianDetailsSection from './FormSections/ParentGuardianDetailsSection';
import AcademicDetailsSection from './FormSections/AcademicDetailsSection';
import FinancialDetailsSection from './FormSections/FinancialDetailsSection';
import ExtracurricularDetailsSection from './FormSections/ExtracurricularDetailsSection';
import DeclarationSection from './FormSections/DeclarationSection';

const EnrollmentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StudentEnrollmentForm>({
    personalDetails: {} as any,
    addressDetails: {
      permanent: {
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        toleStreet: '',
        houseNumber: '',
      },
      isSameAsPermanent: false,
      temporary: {
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        toleStreet: '',
        houseNumber: '',
        sameAsPermanent: false,
      },
    } as any,
    parentGuardianDetails: {
      father: {
        fullName: '',
        occupation: '',
        designation: '',
        organization: '',
        mobileNumber: '',
        email: '',
      },
      mother: {
        fullName: '',
        occupation: '',
        designation: '',
        organization: '',
        mobileNumber: '',
        email: '',
      },
      legalGuardians: [],
      annualFamilyIncome: '',
    } as any,
    academicDetails: {
      currentEnrollment: {
        faculty: '',
        program: '',
        courseLevel: '',
        academicYear: '',
        semesterClass: '',
        section: '',
        enrollDate: '',
        academicStatus: '',
      },
      previousHistory: [],
    } as any,
    financialDetails: {
      feeCategory: '',
      scholarshipDetails: {
        scholarshipType: '',
        scholarshipProviderName: '',
        scholarshipAmount: '',
      },
      bankDetails: undefined,
    } as any,
    extracurricularDetails: {
      interests: [],
      otherInterestDetails: '',
      previousAwards: [],
      hostellerStatus: '',
      transportationMethod: '',
    } as any,
    declaration: {
      agreedToTerms: false,
      dateOfApplication: new Date().toISOString().split('T')[0],
      place: '',
    } as any,
  });

  const totalSteps = 7;

  const handlePersonalDetailsChange = (field: keyof PersonalDetails, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleAddressDetailsChange = (path: string, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => {
      const newData = { ...prev };
      const keys = path.split('.');
      
      if (keys.length === 1) {
        // Top level
        (newData.addressDetails as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested (e.g., permanent.province)
        if (!newData.addressDetails[keys[0] as keyof AddressDetails]) {
          (newData.addressDetails as any)[keys[0]] = {};
        }
        (newData.addressDetails[keys[0] as keyof AddressDetails] as any)[keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleParentGuardianDetailsChange = (path: string, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => {
      const newData = { ...prev };
      const keys = path.split('.');
      
      if (keys.length === 1) {
        // Top level
        (newData.parentGuardianDetails as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested (e.g., father.fullName)
        if (!newData.parentGuardianDetails[keys[0] as keyof ParentGuardianDetails]) {
          (newData.parentGuardianDetails as any)[keys[0]] = {};
        }
        (newData.parentGuardianDetails[keys[0] as keyof ParentGuardianDetails] as any)[keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleAcademicDetailsChange = (path: string, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => {
      const newData = { ...prev };
      const keys = path.split('.');
      
      if (keys.length === 1) {
        // Top level (previousHistory)
        (newData.academicDetails as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested (e.g., currentEnrollment.faculty)
        if (!newData.academicDetails[keys[0] as keyof AcademicDetails]) {
          (newData.academicDetails as any)[keys[0]] = {};
        }
        (newData.academicDetails[keys[0] as keyof AcademicDetails] as any)[keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleFinancialDetailsChange = (path: string, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => ({
      ...prev,
      financialDetails: {
        ...prev.financialDetails,
        [path]: value
      }
    }));
  };

  const handleExtracurricularDetailsChange = (path: string, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => ({
      ...prev,
      extracurricularDetails: {
        ...prev.extracurricularDetails,
        [path]: value
      }
    }));
  };

  const handleDeclarationChange = (path: string, value: any) => {
    setFormData((prev: StudentEnrollmentForm) => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [path]: value
      }
    }));
  };

  const handleNext = () => {
    // Validate current step data before moving to next
    try {
      const dataToValidate: any = {};
      
      switch (currentStep) {
        case 1:
          dataToValidate.personal = formData.personalDetails;
          console.log('Validating Personal Details:', formData.personalDetails);
          EnrollmentFormSchema.pick({ personal: true }).parse(dataToValidate);
          break;
        case 2:
          dataToValidate.address = formData.addressDetails;
          console.log('Validating Address Details:', formData.addressDetails);
          EnrollmentFormSchema.pick({ address: true }).parse(dataToValidate);
          break;
        case 3:
          dataToValidate.guardian = formData.parentGuardianDetails;
          console.log('Validating Guardian Details:', formData.parentGuardianDetails);
          EnrollmentFormSchema.pick({ guardian: true }).parse(dataToValidate);
          break;
        case 4:
          dataToValidate.academic = formData.academicDetails;
          console.log('Validating Academic Details:', formData.academicDetails);
          EnrollmentFormSchema.pick({ academic: true }).parse(dataToValidate);
          break;
        case 5:
          dataToValidate.financial = formData.financialDetails;
          console.log('Validating Financial Details:', formData.financialDetails);
          EnrollmentFormSchema.pick({ financial: true }).parse(dataToValidate);
          break;
        case 6:
          dataToValidate.extracurricular = formData.extracurricularDetails;
          console.log('Validating Extracurricular Details:', formData.extracurricularDetails);
          EnrollmentFormSchema.pick({ extracurricular: true }).parse(dataToValidate);
          break;
        case 7:
          dataToValidate.declaration = formData.declaration;
          console.log('Validating Declaration:', formData.declaration);
          EnrollmentFormSchema.pick({ declaration: true }).parse(dataToValidate);
          break;
      }
      
      // If validation passes, clear errors and move to next step
      setValidationErrors([]);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      // Check if it's a ZodError
      if (error.issues && Array.isArray(error.issues)) {
        const formattedErrors = formatZodErrors(error);
        setValidationErrors(formattedErrors);
        console.error(`Validation errors on step ${currentStep}:`, formattedErrors);
        console.error('Raw ZodError issues:', error.issues);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors([]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Map internal form structure to schema structure for validation
      const dataToValidate = {
        personal: formData.personalDetails,
        address: formData.addressDetails,
        guardian: formData.parentGuardianDetails,
        academic: formData.academicDetails,
        financial: formData.financialDetails,
        extracurricular: formData.extracurricularDetails,
        declaration: formData.declaration,
      };

      // Validate entire form
      EnrollmentFormSchema.parse(dataToValidate);
      
      setValidationErrors([]);
      setIsSubmitting(true);

      // Submit to backend API
      const response = await submitStudentEnrollment(formData);

      setIsSubmitting(false);

      if (response.success) {
        console.log('=== STUDENT ENROLLMENT FORM SUBMITTED SUCCESSFULLY ===');
        console.log(JSON.stringify(formData, null, 2));
        console.log('API Response:', response.data);
        
        alert(`✓ Form submitted successfully!\n\n${response.message}\n\nYour enrollment has been recorded in the system.`);
        
        // Optional: Reset form or redirect
        // window.location.href = '/success';
      } else {
        console.error('API Error:', response.errors);
        alert(`❌ Submission failed!\n\n${response.message}\n\nErrors:\n${response.errors?.join('\n')}`);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      
      // Check if it's a ZodError
      if (error.issues && Array.isArray(error.issues)) {
        const errors = formatZodErrors(error);
        setValidationErrors(errors);
        console.error('Form validation errors:', errors);
        alert('Please fix the validation errors before submitting.');
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsSection 
            data={formData.personalDetails}
            onChange={handlePersonalDetailsChange}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <AddressDetailsSection 
            data={formData.addressDetails}
            onChange={handleAddressDetailsChange}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <ParentGuardianDetailsSection 
            data={formData.parentGuardianDetails}
            onChange={handleParentGuardianDetailsChange}
            errors={validationErrors}
          />
        );
      case 4:
        return (
          <AcademicDetailsSection 
            data={formData.academicDetails}
            onChange={handleAcademicDetailsChange}
            errors={validationErrors}
          />
        );
      case 5:
        return (
          <FinancialDetailsSection 
            data={formData.financialDetails}
            onChange={handleFinancialDetailsChange}
            errors={validationErrors}
          />
        );
      case 6:
        return (
          <ExtracurricularDetailsSection 
            data={formData.extracurricularDetails}
            onChange={handleExtracurricularDetailsChange}
            errors={validationErrors}
          />
        );
      case 7:
        return (
          <DeclarationSection 
            data={formData.declaration}
            onChange={handleDeclarationChange}
            errors={validationErrors}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Personal & Biometric Details',
    'Address Details',
    'Parent/Guardian Details',
    'Academic Details',
    'Financial Details',
    'Extracurricular & Other Info',
    'Declaration',
  ];

  return (
    <div className="enrollment-form-container">
      <header className="form-header">
        <h1>Student Enrollment Form</h1>
        <p>Step {currentStep} of {totalSteps}</p>
      </header>

      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="form-steps-indicator">
        {stepTitles.map((title, index) => (
          <div 
            key={index + 1}
            className={`step-indicator ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(index + 1)}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-title">{title}</span>
          </div>
        ))}
      </div>

      <div className="form-content">
        <h2>{stepTitles[currentStep - 1]}</h2>
        {getStepContent()}
      </div>

      <div className="form-navigation">
        <button 
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </button>

        {currentStep === totalSteps ? (
          <button 
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={!formData.declaration.agreedToTerms || !formData.declaration.place || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        ) : (
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default EnrollmentForm;
