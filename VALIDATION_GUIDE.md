# Form Validation Guide

This student enrollment form uses **Zod** for TypeScript-first schema validation.

## How Validation Works

### Schema Files
- **`src/validation/schema.ts`** - Contains all Zod schemas for form validation
  - Individual section schemas (PersonalDetails, AddressDetails, etc.)
  - Complete form schema that validates all sections together
  - TypeScript type exports for type-safe form data

- **`src/validation/utils.ts`** - Validation utilities
  - `formatZodErrors()` - Converts Zod errors to readable format
  - `getFieldError()` - Gets error message for a specific field
  - `hasFieldError()` - Checks if a field has validation errors

### Validation Components
- **`src/components/ValidationErrorDisplay.tsx`** - Displays inline field errors
- **`src/components/ValidationSummary.tsx`** - Displays all validation errors at the top of form

### Validation Points

#### Step Navigation Validation
When clicking "Next" button, the current step data is validated:
- Invalid data shows validation summary at top
- User cannot proceed to next step until errors are fixed
- Helpful error messages guide the user to correct fields

#### Form Submission Validation
When clicking "Submit" button:
- Entire form is validated (all 7 sections)
- All validation errors are displayed in summary
- User cannot submit until all errors are fixed

## Validation Rules by Section

### 1. Personal Details
- **fullName**: 3-100 characters
- **email**: Valid email format
- **phoneNumber**: Exactly 10 digits
- **citizenship**: At least 5 characters
- **dateOfBirth**: Required, must be valid date
- **gender, ethnicity, religion**: Required selection
- **disability**: If true, disabilityType must be provided
- **emergencyContact**: Name (2+ chars), Phone (10 digits), Relation required

### 2. Address Details
- **Permanent Address**: Province, District, Municipality, Ward, Street all required
- **Temporary Address**: Only validated if "isSameAsPermanent" is false

### 3. Parent/Guardian Details
- **Father/Mother**: Name (2+ chars), Occupation, Phone (10 digits) all required
- **Legal Guardians**: Array with at least one guardian (optional)
  - Each guardian: Name (2+ chars), Relation, Phone (10 digits)
- **Annual Family Income**: Required selection

### 4. Academic Details
- **Current Enrollment**: Faculty, Program, Academic Year, Semester all required
- **Previous Qualifications**: At least one qualification required
  - Qualification type, Board/University, Institution (2+ chars), Year, GPA/Division all required
- **Documents**: Optional file uploads
  - Citizenship Front/Back, Signature, Character Certificate

### 5. Financial Details
- **feeCategory**: Required selection
- **Scholarship**: If selected, type, provider, amount required
- **Bank Details**: If selected, bank name, account number, account holder required

### 6. Extracurricular Details
- **interests**: At least one interest must be selected
- **otherInterest**: Required if "Other" is selected
- **awards**: Array of awards (optional)
- **hosteller**: Required selection
- **transportation**: Required selection

### 7. Declaration
- **agreeToTerms**: Must be checked (true)
- **date**: Required
- **place**: At least 2 characters

## How to Use in Components

### Adding Validation Error Display
```tsx
import { ValidationErrorDisplay } from '../../components/ValidationErrorDisplay';

// In your form section component:
<ValidationErrorDisplay errors={errors} fieldPath="personal.fullName" />
```

### Validating a Specific Section
```tsx
import { PersonalDetailsSchema } from '../../validation/schema';

try {
  PersonalDetailsSchema.parse(personalDetailsData);
  // Valid data
} catch (error) {
  // Handle error
}
```

## Error Messages
Each validation rule includes a specific error message that helps users understand what went wrong:
- Too short/long strings
- Invalid email format
- Phone number must be digits
- Required field not filled
- Invalid selection

## Benefits
✅ Type-safe validation with TypeScript  
✅ Single source of truth for validation rules  
✅ Clear, user-friendly error messages  
✅ Prevents submission of invalid data  
✅ Easy to maintain and update validation rules  
✅ Can be reused on backend with same schema
