# Quick Start: Testing Profile Photo & Documents Fix

## What Was Fixed

When searching by PID (like `7910a7fa-ccd9-49fa-9391-137b1fe01b6e`), the form now automatically fetches:

- ✅ **Profile Photos** - if not included in main API response
- ✅ **Documents** - if not included in main API response

## How to Test

### Step 1: Start the Application

```bash
npm run dev
```

### Step 2: Go to Edit Data Page

1. Open browser: http://localhost:5173
2. Click on "Edit Data" page
3. Enter a Student PID (like the one from the screenshot)
4. Click "Search"

### Step 3: Check Results

**Photo should appear here:**

```
Personal Details Section
  └─ Profile Photo field
     └─ Should show image (not "Click to upload")
```

**Documents should appear below the form:**

```
Current Admission Documents section
  └─ Profile Photo card
  └─ Document cards (if any)
  └─ Links to download documents
```

## Debug Console Logs

### To View Logs:

1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Search by PID
4. Look for these logs:

```
🖼️ PHOTO RESOLUTION: {
  resolved_photoPath: "uploads/student-photo.jpg",
  resolved_profilePhotoUrl: "https://localhost:7257/uploads/student-photo.jpg"
}

📄 Documents not found in student data, fetching separately...
✓ Documents merged into student data

🖼️ Fetching profile photo for student: 7910a7fa-...
✓ Photo merged into student data
```

## Expected Behavior

### ✅ If Working Correctly:

1. **Search by PID**
   - Form loads with all data
   - No errors in console

2. **Profile Photo**
   - Shows actual photo image
   - Not the "Click to upload" placeholder

3. **Documents Section**
   - Shows "Current Admission Documents"
   - Displays photo thumbnail
   - Lists any uploaded documents
   - Links are clickable

4. **Console**
   - Shows 🖼️ and 📄 logs
   - No red error messages

### ⚠️ If Not Working:

**Photo shows upload placeholder:**

- Check console for 🖼️ logs
- Note any error messages
- Verify `photoPath` in response

**Documents don't show:**

- Check console for 📄 logs
- Look for 404 errors in Network tab
- Verify documents exist in database

**Form doesn't load:**

- Check Network tab for failed requests
- Look for red errors in console
- Verify backend is running on https://localhost:7257

## Network Tab Check

To see what API calls are being made:

1. Open DevTools → **Network** tab
2. Search by PID
3. Look for these requests:

```
GET /api/Student/7910a7fa-...          ← Main student data
GET /api/Student/7910a7fa-.../documents ← If documents missing
GET /api/Student/7910a7fa-.../photo    ← If photo missing
```

Each should return **200 OK** status.

## Common Issues & Solutions

### Issue: Photo shows blank/broken

**Solution:**

1. Check if `photoPath` has correct value in Network tab
2. Verify file path is accessible: `BACKEND_ORIGIN + photoPath`
3. Check browser CORS settings (in Network tab errors)

### Issue: Documents section missing

**Solution:**

1. Scroll down to find "Current Admission Documents" section
2. Check console for fetch errors (404s)
3. Verify documents endpoint exists on backend

### Issue: Form shows "Please check the ID or PID"

**Solution:**

1. Verify PID is correct (copy from display)
2. Check backend logs for errors
3. Verify backend is running: https://localhost:7257

### Issue: Empty upload field with no photo

**Solution:**

1. Check Network tab → `/api/Student/{pid}` response
2. Look for `photoPath` field in response
3. If present, check console 🖼️ logs for URL resolution errors
4. If absent, backend needs to include it

## Files Changed

These changes were made to fix the photo/documents issue:

```
✅ src/services/api.ts
   - Added getStudentProfilePhoto()
   - Enhanced getStudentById() with photo fetch

✅ src/pages/EditDataPage.tsx
   - Enhanced mapStudentToFormData()
   - Added photo resolution logging
   - Better handling of missing data

✅ vite.config.ts
   - Fixed TypeScript compilation errors
```

## Need More Help?

### Check Backend Response Structure

In Network tab, inspect `/api/Student/{pid}` response. It should look like:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "firstName": "John",
    "photoPath": "uploads/photos/student.jpg",
    "documents": [
      {
        "documentType": "Passport",
        "url": "uploads/documents/passport.pdf"
      }
    ]
  }
}
```

### If Backend Doesn't Return These Fields

The API now has fallbacks to fetch them separately from:

- `GET /api/Student/{id}/photo` - returns `{ photoPath: "..." }`
- `GET /api/Student/{id}/documents` - returns `[{ ... }]`

If these endpoints don't exist, they need to be created on the backend.

---

**✅ Build Status**: Compilation successful - No TypeScript errors
**✅ Features**: Photo fallback fetch enabled
**✅ Features**: Documents fallback fetch enabled
**✅ Logging**: Comprehensive console logging added
