# Document & Photo Fetch Fix - Summary

## Problem

When searching for a student by PID (using the Edit Data page), the backend returns student data but **does not include**:

- Profile photos (`photoPath`)
- Documents array (`documents` - documentation links, files, etc.)

## Root Cause

The backend API endpoint `/api/Student/{pid}` may not include the full document and photo information in its response. These fields need to be fetched separately or the API needs to be updated to include them.

## Solution Implemented

### 1. **New API Function: `getStudentDocuments()`**

**File**: [src/services/api.ts](src/services/api.ts)

Added a new function that fetches documents for a student separately:

```typescript
export const getStudentDocuments = async (studentIdOrPid: string): Promise<ApiResponse<any[]>>
```

- Calls `/api/Student/{studentIdOrPid}/documents` endpoint
- Returns an empty array gracefully if documents are not found (doesn't break the flow)
- Handles both success and error cases

### 2. **Enhanced `getStudentById()` Function**

**File**: [src/services/api.ts](src/services/api.ts)

Updated the `getStudentById()` function to:

- Check if documents are missing or empty in the student data
- **Automatically fetch documents separately** if not included
- **Merge documents** back into the student data object
- Support all three lookup strategies (direct ID, numeric ID, UUID/PID)

**Key changes**:

```typescript
// After fetching student data:
if (
  !studentData.documents ||
  (Array.isArray(studentData.documents) && studentData.documents.length === 0)
) {
  const docsRes = await getStudentDocuments(idOrPid);
  if (docsRes.success && docsRes.data) {
    studentData.documents = docsRes.data;
  }
}
```

### 3. **Enhanced Logging in EditDataPage**

**File**: [src/pages/EditDataPage.tsx](src/pages/EditDataPage.tsx)

Added diagnostic logging to track documents and photos:

```typescript
console.log("📸 DOCUMENTS & PHOTOS:", {
  photoPath: studentData.photoPath,
  documents: studentData.documents,
  documentCount: Array.isArray(studentData.documents)
    ? studentData.documents.length
    : 0,
  hasPhoto: !!studentData.photoPath,
});
```

## How It Works

### Flow Diagram

```
User enters PID and searches
         ↓
getStudentById(pid) is called
         ↓
Try direct API fetch: /api/Student/{pid}
         ↓
Check: Are documents included?
  ├─ YES → Return student data
  └─ NO → Fetch separately from /api/Student/{pid}/documents
         ↓
Merge documents into student data
         ↓
Return complete student object with documents
         ↓
EditDataPage displays documents & photos
```

## Testing

### How to Test:

1. **Start your backend** on `https://localhost:7257`
2. **Start the frontend**:
   ```bash
   npm run dev
   ```
3. **Open the Edit Data page**
4. **Enter a student PID** and click "Search"
5. **Check browser console** (F12) for logs:
   - Look for: `📸 DOCUMENTS & PHOTOS:` log
   - Check `documentCount` to see if documents were fetched
   - Look for: `📄 Fetching documents for student:` if documents needed separate fetch

### Expected Behavior:

- ✅ Student personal data loads
- ✅ Student address data loads
- ✅ Student academic data loads
- ✅ Profile photo appears (if `photoPath` is set)
- ✅ Documents appear in "Current Admission Documents" section (if available)

### Debug Information:

All relevant logs are available in the browser console with emoji prefixes:

- `📸` - Document and photo information
- `📄` - Document fetch attempts
- `🔍` - Student search attempts
- `✓` - Successful operations
- `❌` - Errors

## Fallback Behavior

If the documents endpoint doesn't exist on your backend:

- The system **won't crash** - it gracefully handles the error
- You'll see a warning in console but the form continues to load
- The `documents` array will be empty

## Alternative Solution (If Backend Doesn't Have Documents Endpoint)

If your backend doesn't have a `/api/Student/{id}/documents` endpoint, you can:

1. **Option A**: Have the backend include `documents` and `photoPath` in the `/api/Student/{pid}` response
2. **Option B**: Create a new backend endpoint that returns documents
3. **Option C**: Update the `getStudentDocuments()` function to handle your actual endpoint structure

## Files Modified

1. **[src/services/api.ts](src/services/api.ts)**
   - Added `getStudentDocuments()` function
   - Enhanced `getStudentById()` function with fallback logic

2. **[src/pages/EditDataPage.tsx](src/pages/EditDataPage.tsx)**
   - Added diagnostic logging for documents and photos

## Next Steps

1. **Verify backend API endpoints** exist or align them with what the code expects
2. **Check backend response** for documents and photos structure
3. **Test with PID search** and verify documents appear
4. **Check console logs** for any errors or missing data

## Questions?

If documents still don't appear:

1. Check backend logs to see if documents endpoint is being called
2. Verify the response structure matches what the code expects
3. Check that documents actually exist in the database for the student
