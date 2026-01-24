# Profile Photo & Documents Fix - Complete Implementation

## Problem Statement

When searching for a student by PID in the Edit Data page, the form loads successfully but:

- **Profile photo is NOT displayed** (shows empty upload field instead)
- **Documents (certifications, links) are NOT displayed** (not shown in Current Admission Documents section)

The root cause is that the backend API endpoint `/api/Student/{pid}` returns basic student data but **omits**:

- `photoPath` field
- `documents` array

## Solution Overview

A three-layered approach to fetch missing data:

```
User searches by PID
       ↓
Backend returns student data
       ↓
Check: Are documents & photo included?
  ├─ YES → Display form with all data
  └─ NO → Fetch them separately from dedicated endpoints
       ↓
Merge missing data back into student object
       ↓
Form displays with complete photo & documents
```

## Implementation Details

### 1. New Function: `getStudentProfilePhoto()`

**File**: [src/services/api.ts](src/services/api.ts)

```typescript
export const getStudentProfilePhoto = async (studentIdOrPid: string): Promise<ApiResponse<{photoPath: string}>>
```

**What it does**:

- Tries multiple endpoints to fetch profile photo:
  - `/api/Student/{id}/photo`
  - `/api/Student/{id}/profile-photo`
  - `/api/Student/{id}/photopath`
- Returns gracefully if no endpoint exists (won't break the app)
- Logs attempts with 🖼️ emoji for debugging

**Example response**:

```typescript
{ success: true, data: { photoPath: "uploads/photos/student-123.jpg" } }
```

### 2. Enhanced: `getStudentById()`

**File**: [src/services/api.ts](src/services/api.ts)

Now includes automatic fallback fetching for missing data:

```typescript
if (studentData) {
  // Fetch documents if missing
  if (!studentData.documents || studentData.documents.length === 0) {
    const docsRes = await getStudentDocuments(idOrPid);
    if (docsRes.success) {
      studentData.documents = docsRes.data;
    }
  }

  // Fetch photo if missing
  if (!studentData.photoPath || studentData.photoPath.trim() === "") {
    const photoRes = await getStudentProfilePhoto(idOrPid);
    if (photoRes.success && photoRes.data?.photoPath) {
      studentData.photoPath = photoRes.data.photoPath;
    }
  }

  return { success: true, data: studentData };
}
```

**Supports all lookup strategies**:

- Direct ID/PID lookup
- Numeric ID search with full record fetch
- UUID/PID lookup with `/pid/` endpoint

### 3. Enhanced: `mapStudentToFormData()`

**File**: [src/pages/EditDataPage.tsx](src/pages/EditDataPage.tsx)

**Updates**:

- Checks multiple possible photo paths:
  ```typescript
  const photoPath =
    student.photoPath ||
    student.personalDetails?.photoPath ||
    student.personalDetails?.profilePhotoPath ||
    "";
  ```
- Adds comprehensive diagnostic logging:
  ```typescript
  console.log("🖼️ PHOTO RESOLUTION:", {
    raw_photoPath: student.photoPath,
    raw_personalDetails_photoPath: student.personalDetails?.photoPath,
    raw_personalDetails_profilePhotoPath:
      student.personalDetails?.profilePhotoPath,
    resolved_photoPath: photoPath,
    resolved_profilePhotoUrl: profilePhotoUrl,
    BACKEND_ORIGIN,
  });
  ```

### 4. Updated: `PersonalDetailsSection`

**File**: [src/components/FormSections/PersonalDetailsSection.tsx](src/components/FormSections/PersonalDetailsSection.tsx)

Already had proper support for `profilePhotoUrl`:

```typescript
useEffect(() => {
  if (data.profileImage instanceof File) {
    // Handle new file upload
  } else if (data.profilePhotoUrl && typeof data.profilePhotoUrl === "string") {
    // Display existing photo from URL
    setImagePreview(data.profilePhotoUrl);
  }
}, [data.profileImage, data.profilePhotoUrl]);
```

### 5. Fixed: Vite Config TypeScript Errors

**File**: [vite.config.ts](vite.config.ts)

Removed problematic config properties and unused parameters:

- Removed `rejectUnauthorized` (not supported in Vite proxy)
- Fixed unused function parameters with underscore prefix

## Console Logging

All operations log with emoji prefixes for easy debugging:

```
🔍 Searching for student: 7910a7fa-ccd9-49fa-9391-137b1fe01b6e
✓ Direct lookup found
📄 Documents not found in student data, fetching separately...
✓ Documents merged into student data
🖼️ Photo not found in student data, fetching separately...
🖼️ Fetching profile photo for student: 7910a7fa-ccd9-49fa-9391-137b1fe01b6e
✓ Photo found at /api/Student/{id}/photo
✓ Photo merged into student data
🖼️ PHOTO RESOLUTION: { ... }
```

## How It Works: Step by Step

### When User Searches by PID

1. **Search initiated**

   ```
   User enters PID: 7910a7fa-ccd9-49fa-9391-137b1fe01b6e
   Clicks "Search"
   ```

2. **Initial data fetch**

   ```
   GET /api/Student/7910a7fa-ccd9-49fa-9391-137b1fe01b6e
   ↓
   Backend returns: { firstName: "John", lastName: "Doe", ... }
   (NOTE: photoPath and documents are MISSING)
   ```

3. **Check for missing data**

   ```
   Frontend checks response:
   - Is documents array present? ❌ NO
   - Is photoPath present? ❌ NO
   ↓
   Trigger fallback fetches
   ```

4. **Parallel fallback fetches**

   ```
   getStudentDocuments(pid)
   ↓ Tries /api/Student/{pid}/documents
   ↓ Returns: { data: [{ documentType: "Passport", url: "..." }] }

   getStudentProfilePhoto(pid)
   ↓ Tries /api/Student/{pid}/photo, /profile-photo, /photopath
   ↓ Returns: { data: { photoPath: "uploads/photo.jpg" } }
   ```

5. **Merge and display**
   ```
   Merge fetched data into studentData object
   ↓
   Pass to mapStudentToFormData()
   ↓
   Set formData state
   ↓
   PersonalDetailsSection renders photo
   ↓
   Document viewer displays documents
   ```

## Testing Checklist

- [ ] **Test 1: Photo Display**
  - Search by PID
  - Check if profile photo appears (not upload field)
  - Open browser console → Look for `🖼️ PHOTO RESOLUTION` log

- [ ] **Test 2: Documents Display**
  - Search by PID
  - Scroll to "Current Admission Documents" section
  - Check if documents appear
  - Open browser console → Look for `📄 Documents` log

- [ ] **Test 3: Console Logs**
  - Open DevTools (F12)
  - Go to Console tab
  - Search by PID
  - Verify logs show photo and documents being fetched/resolved

- [ ] **Test 4: Fallback Behavior**
  - Search by PID for student without photo
  - Form should still load without errors
  - Console should show `⚠️ No photo endpoint found`

- [ ] **Test 5: Mixed Data**
  - Search by PID for student with photo but no documents
  - Photo should display
  - Documents section should be empty but not show errors

## Files Modified

### 1. [src/services/api.ts](src/services/api.ts)

- Added `getStudentProfilePhoto()` function
- Enhanced `getStudentById()` with photo fetch fallback
- Both documents and photos are now fetched if missing

### 2. [src/pages/EditDataPage.tsx](src/pages/EditDataPage.tsx)

- Enhanced `mapStudentToFormData()` to check multiple photo path fields
- Added `🖼️ PHOTO RESOLUTION` diagnostic logging
- Better handling of missing/null values

### 3. [vite.config.ts](vite.config.ts)

- Fixed TypeScript errors in proxy configuration
- Removed unsupported `rejectUnauthorized` property
- Fixed unused function parameters

## Backward Compatibility

✅ **100% backward compatible**

- If backend includes photo/documents, they are used directly
- If backend doesn't have fallback endpoints, app doesn't crash
- Graceful degradation with console warnings

## If Issues Persist

### Photo Still Not Showing?

1. **Check console logs** (F12 → Console tab)
   - Look for `🖼️ PHOTO RESOLUTION` log
   - Check `resolved_photoPath` and `resolved_profilePhotoUrl`
   - Check `BACKEND_ORIGIN` value

2. **Verify backend response**
   - Open DevTools → Network tab
   - Search by PID
   - Check `/Student/{pid}` response body
   - Look for `photoPath` field

3. **Check photo endpoints exist**
   - Test these URLs in browser:
     - `/api/Student/{pid}/photo`
     - `/api/Student/{pid}/profile-photo`
     - `/api/Student/{pid}/photopath`

4. **Backend needs update?**
   - If none of above endpoints exist, backend needs new endpoint
   - Or backend should include `photoPath` in main response

### Documents Still Not Showing?

Same process as photos, but look for:

- `/api/Student/{pid}/documents` endpoint
- `documents` array in response body
- Console logs with `📄` emoji

## Summary of Benefits

✅ Automatic photo fetching if missing from main response
✅ Automatic document fetching if missing from main response
✅ Zero impact if data is already in response
✅ Comprehensive logging for debugging
✅ Graceful error handling (won't crash the app)
✅ Supports all three lookup strategies (ID, numeric, UUID/PID)
✅ Works with existing PersonalDetailsSection component
✅ Maintains form functionality with or without images/docs
