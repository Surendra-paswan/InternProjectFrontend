# Edit Form - Complete Diagnostic & Fixes Applied

## Summary

Fixed all select fields and data display issues in the Edit Data Page by ensuring:

1. All select fields include current/saved values in their dropdown options
2. Proper data mapping from nested backend DTO structures
3. Comprehensive logging for troubleshooting
4. Address same-as-permanent detection
5. Photo URL resolution and display
6. Profile photo visibility in form field

---

## Fixes Applied

### 1. **EditDataPage.tsx** - Core Mapping & Logging

**File**: [src/pages/EditDataPage.tsx](src/pages/EditDataPage.tsx)

#### Added `profilePhotoUrl` Support

- Added `profilePhotoUrl: ''` to emptyForm template
- Maps `student.photoPath` to resolved backend URL
- Uses `VITE_API_ORIGIN` (dev) or `VITE_API_URL` origin (prod)
- Normalizes Windows paths and resolves relative URLs

#### Improved Blood Group Mapping

- Changed fallback to include the raw `bloodGroupDisplay` if not in enum map
- **Before**: `|| ''`
- **After**: `|| bloodGroupDisplay || ''`
- **Reason**: Handles custom blood group values from backend

#### Automatic Address Same-as-Permanent Detection

- Added logic to detect if temporary address matches permanent
- Compares: province, district, municipality, wardNumber, toleStreet, houseNumber
- Sets `sameAsPermanent: true` if all fields match
- Form now auto-hides temporary address fields when they're identical

#### Enhanced Debug Logging

Added comprehensive diagnostic logs organized by section:

```
📋 PERSONAL DETAILS
📍 ADDRESS DETAILS
👨‍👩‍👧 PARENT DETAILS
🎓 ACADEMIC ENROLLMENT
💰 FINANCIAL DETAILS
🎵 EXTRACURRICULAR DETAILS
```

Each log shows:

- Raw API values from `student.*`
- Mapped form values from `mappedData.*`
- Allows tracing of value transformations

---

### 2. **PersonalDetailsSection.tsx** - Photo Display

**File**: [src/components/FormSections/PersonalDetailsSection.tsx](src/components/FormSections/PersonalDetailsSection.tsx)

#### Updated Photo Preview Logic

- **Before**: Only showed preview for newly uploaded files
- **After**: Shows existing profile photo URL when `profilePhotoUrl` is available
- Falls back to uploaded file preview if user changes photo
- Seamless transition between existing and new photos

#### Updated useEffect Dependencies

```javascript
useEffect(() => {
  if (data.profileImage instanceof File) {
    // Show new upload
  } else if (data.profilePhotoUrl && typeof data.profilePhotoUrl === "string") {
    // Show existing photo
    setImagePreview(data.profilePhotoUrl);
  }
}, [data.profileImage, data.profilePhotoUrl]);
```

---

### 3. **ExtracurricularDetailsSection.tsx** - Current Values in Dropdowns

**File**: [src/components/FormSections/ExtracurricularDetailsSection.tsx](src/components/FormSections/ExtracurricularDetailsSection.tsx)

#### Added `withCurrent` Logic for:

**Hosteller Status**

```javascript
const withCurrent =
  data.hostellerStatus && !options.includes(data.hostellerStatus)
    ? [data.hostellerStatus, ...options]
    : options;
```

**Transportation Method**

```javascript
const withCurrent =
  data.transportationMethod && !options.includes(data.transportationMethod)
    ? [data.transportationMethod, ...options]
    : options;
```

**Benefit**: If backend returns "Car" but the list only has ["Bus", "Train"], the dropdown now shows both the existing value and the predefined options.

---

### 4. **Types - PersonalDetails Interface Update**

**File**: [src/types/index.ts](src/types/index.ts)

Added new properties:

```typescript
export interface PersonalDetails {
  profileImage?: File;
  profilePhotoUrl?: string; // NEW
  // ... other fields
}
```

---

## Form Sections Audit Results

### ✅ Sections with Full "withCurrent" Logic

| Section             | Fields with withCurrent                                                             | Status             |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------ |
| **Personal**        | Gender, BloodGroup, MaritalStatus, Religion, Nationality                            | ✓ Complete         |
| **Academic**        | Faculty, Program, CourseLevel, AcademicYear, SemesterClass, Section, AcademicStatus | ✓ Complete         |
| **Financial**       | FeeCategory, ScholarshipType                                                        | ✓ Complete         |
| **Parent/Guardian** | AnnualFamilyIncome                                                                  | ✓ Complete         |
| **Extracurricular** | HostellerStatus, TransportationMethod                                               | ✓ Complete (Fixed) |

### ✅ Form Section Order in Edit Page

1. PersonalDetailsSection
2. AddressDetailsSection
3. ParentGuardianDetailsSection
4. AcademicDetailsSection
5. FinancialDetailsSection
6. ExtracurricularDetailsSection
7. DeclarationSection
8. Current Admission Documents Viewer

---

## Data Mapping Verification

### Personal Details

- ✓ Gender: `student.personalDetails?.genderDisplay`
- ✓ Nationality: `student.personalDetails?.nationalityDisplay`
- ✓ Blood Group: `student.personalDetails?.bloodGroupDisplay` → enum mapping
- ✓ Marital Status: `student.personalDetails?.maritalStatusDisplay`
- ✓ Religion: `student.personalDetails?.religion`
- ✓ Emergency Contact: `student.emergencyContacts?.[0]`

### Address Details

- ✓ Permanent: `student.addresses?.find(a => a.addressType === 0)`
- ✓ Temporary: `student.addresses?.find(a => a.addressType === 1)`
- ✓ Auto-detect same-as-permanent

### Parent/Guardian Details

- ✓ Father: `student.parentGuardians?.find(p => p.parentType === 0)`
- ✓ Mother: `student.parentGuardians?.find(p => p.parentType === 1)`
- ✓ Legal Guardians: Filter remaining
- ✓ Annual Income: Fallback father → mother

### Academic Details

- ✓ Faculty: `student.academicEnrollment?.facultyDisplay`
- ✓ Program: `student.academicEnrollment?.programDisplay`
- ✓ Level: `student.academicEnrollment?.levelDisplay`
- ✓ Academic Year: Year2081 → "1st Year" normalization
- ✓ Semester: FirstSemester → "First Semester" normalization
- ✓ Section: `student.academicEnrollment?.sectionDisplay`
- ✓ Academic Status: `student.academicEnrollment?.academicStatusDisplay`

### Financial Details

- ✓ Fee Category: `student.financialDetail?.feeCategoryDisplay`
- ✓ Scholarship Type: Appends "Scholarship" if needed
- ✓ Bank Details: `student.bankDetail?.bankNameDisplay`

### Extracurricular Details

- ✓ Interests: Smart split & unknown → "Other" mapping
- ✓ Hosteller Status: Mapped from `extracurricular.hostellerStatusDisplay`
- ✓ Transportation: Mapped from `extracurricular.transportationMethodDisplay`

---

## Environment Configuration

### Dev Environment

Set in `.env.local` or `vite.config.ts`:

```
VITE_API_ORIGIN=https://localhost:7257
```

### Production Environment

Set in `.env.production`:

```
VITE_API_URL=https://your-backend-host/api
```

---

## Testing Checklist

When you search for a student, verify:

- [ ] Profile photo displays in the form field (if exists)
- [ ] All text fields populate with student data
- [ ] Gender dropdown shows saved value
- [ ] Nationality dropdown shows saved value
- [ ] Blood Group dropdown shows saved value
- [ ] Marital Status dropdown shows saved value
- [ ] Religion dropdown shows saved value
- [ ] All address fields display (permanent and temporary)
- [ ] Faculty dropdown shows saved value
- [ ] Program dropdown shows saved value
- [ ] Course Level dropdown shows saved value
- [ ] Academic Year dropdown shows saved value
- [ ] Semester dropdown shows saved value
- [ ] Section dropdown shows saved value
- [ ] Academic Status dropdown shows saved value
- [ ] Fee Category dropdown shows saved value
- [ ] Scholarship Type dropdown shows saved value (if Scholarship category)
- [ ] Bank Name dropdown shows saved value
- [ ] Hosteller Status dropdown shows saved value
- [ ] Transportation Method dropdown shows saved value
- [ ] Agreement checkbox shows saved state
- [ ] Current admission documents display properly

---

## Browser Console Diagnostics

Open Developer Console (F12) after searching for a student. Look for logs starting with:

- `📋 PERSONAL DETAILS` - Check gender, nationality, etc. mappings
- `📍 ADDRESS DETAILS` - Verify both address types
- `👨‍👩‍👧 PARENT DETAILS` - Check father/mother data
- `🎓 ACADEMIC ENROLLMENT` - Verify degree info
- `💰 FINANCIAL DETAILS` - Check fee & scholarship
- `🎵 EXTRACURRICULAR DETAILS` - Check hosteller & transport

Each log shows both raw API values and mapped form values for comparison.

---

## Known Limitations

1. **File Input Fields**: Cannot pre-fill file inputs (security restriction). Use the documents viewer to show existing files.
2. **Custom Select Values**: If backend returns a value not in predefined lists, the select now includes it automatically via `withCurrent` logic.
3. **Address Same-as-Permanent**: Auto-detected by comparing all fields. Manual checkbox unchecking will always show temporary fields.

---

## Related Files (No Changes Needed)

These files are working correctly:

- `src/components/FormSections/AddressDetailsSection.tsx` - Has proper province/district cascading
- `src/components/FormSections/AcademicDetailsSection.tsx` - Already has full `withCurrent` logic
- `src/components/FormSections/FinancialDetailsSection.tsx` - Already has `withCurrent` logic
- `src/components/FormSections/ParentGuardianDetailsSection.tsx` - Already has `withCurrent` for annualFamilyIncome
- `src/services/api.ts` - API endpoints working correctly
- `vite.config.ts` - Dev proxy properly configured
