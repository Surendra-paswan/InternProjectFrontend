# Zod Validation Implementation Examples

## 1. Form Submission with Full Validation

```typescript
const handleSubmit = () => {
  try {
    const dataToValidate = {
      personal: formData.personalDetails,
      address: formData.addressDetails,
      guardian: formData.parentGuardianDetails,
      academic: formData.academicDetails,
      financial: formData.financialDetails,
      extracurricular: formData.extracurricularDetails,
      declaration: formData.declaration,
    };

    EnrollmentFormSchema.parse(dataToValidate);
    // All data is valid - proceed with submission
    console.log('Form submitted successfully');
  } catch (error: any) {
    if (error.errors) {
      const errors = formatZodErrors(error);
      setValidationErrors(errors);
      console.error('Validation failed:', errors);
    }
  }
};
```

## 2. Step-by-Step Validation

When user clicks "Next", only the current step is validated:

```typescript
const handleNext = () => {
  try {
    const dataToValidate: any = {};
    
    switch (currentStep) {
      case 1:
        dataToValidate.personal = formData.personalDetails;
        EnrollmentFormSchema.pick({ personal: true }).parse(dataToValidate);
        break;
      case 2:
        dataToValidate.address = formData.addressDetails;
        EnrollmentFormSchema.pick({ address: true }).parse(dataToValidate);
        break;
      // ... other cases
    }
    
    setValidationErrors([]);
    setCurrentStep(currentStep + 1);
  } catch (error: any) {
    if (error.errors) {
      setValidationErrors(formatZodErrors(error));
    }
  }
};
```

## 3. Validation Error Response

When validation fails, you get structured errors:

```typescript
[
  {
    field: "personal.fullName",
    message: "Full name must be at least 3 characters"
  },
  {
    field: "personal.email",
    message: "Invalid email address"
  },
  {
    field: "personal.phoneNumber",
    message: "Phone number must be 10 digits"
  }
]
```

## 4. Displaying Errors to User

### Inline Error Display
```tsx
import { ValidationErrorDisplay } from './ValidationErrorDisplay';

<div className="form-group">
  <label>Email</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <ValidationErrorDisplay errors={validationErrors} fieldPath="personal.email" />
</div>
```

### Summary Error Display
```tsx
import { ValidationSummary } from './ValidationSummary';

<div className="form-content">
  <h2>Personal Details</h2>
  <ValidationSummary errors={validationErrors} />
  {/* Form fields here */}
</div>
```

## 5. Custom Validation Example

If you need to add custom validation rules:

```typescript
import { z } from 'zod';

// Custom validation with refine
const customSchema = z.string()
  .min(3)
  .refine((val) => !val.startsWith(' '), {
    message: "Cannot start with space"
  });

// Custom validation with superRefine
const phoneSchema = z.string()
  .superRefine((val, ctx) => {
    if (val.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone must be exactly 10 digits",
      });
    }
    if (!/^\d+$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone can only contain digits",
      });
    }
  });
```

## 6. Conditional Validation

The form already includes conditional validation:

```typescript
// In schema.ts
address: AddressDetailsSchema = z.object({
  permanent: z.object({ /* required fields */ }),
  isSameAsPermanent: z.boolean(),
  temporary: z.object({ /* optional fields */ }).optional(),
});
```

Only validates temporary address if `isSameAsPermanent` is false.

## 7. File Upload Validation

```typescript
// In schema.ts
profileImage: z.instanceof(File).optional(),
citizenshipFrontUpload: z.instanceof(File).optional(),
marksheet: z.instanceof(File).optional(),

// All file uploads are optional, but when present, must be actual File objects
```

## 8. Testing Validation

```typescript
// Test with valid data
const validData = {
  personal: {
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "9841234567",
    // ... other required fields
  }
};

PersonalDetailsSchema.parse(validData); // ✓ Success

// Test with invalid data
const invalidData = {
  personal: {
    fullName: "Jo", // Too short!
    email: "invalid-email", // Invalid format!
    phoneNumber: "abc123", // Not digits!
  }
};

PersonalDetailsSchema.parse(invalidData); // ✗ Throws error
```

## Benefits of This Approach

✅ **Type-Safe**: TypeScript infers types from Zod schemas  
✅ **Reusable**: Same validation on frontend and backend  
✅ **Clear Errors**: User-friendly error messages  
✅ **Maintainable**: Single source of truth for validation rules  
✅ **Flexible**: Easy to add custom rules and conditions  
✅ **Tested**: Zod is well-tested and widely used in industry
