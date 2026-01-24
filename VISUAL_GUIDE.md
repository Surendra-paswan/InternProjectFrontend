# Visual Guide: Profile Photo & Documents Fix

## The Problem (Before Fix)

```
User: Search by PID
"7910a7fa-ccd9-49fa-9391-137b1fe01b6e"
      ↓
   Backend
   /api/Student/{pid}
      ↓
Response: {
  firstName: "Ramsewak",
  lastName: "Kumar",
  email: "...",
  // ❌ photoPath missing
  // ❌ documents array missing
}
      ↓
Frontend: Form loads but...
   Profile Photo Field
   ├─ Shows: 📷 "Click to upload (PNG, JPG)"
   └─ ❌ NOT showing actual student photo

   Current Admission Documents
   └─ ❌ NOT showing any documents
```

## The Solution (After Fix)

```
User: Search by PID
"7910a7fa-ccd9-49fa-9391-137b1fe01b6e"
      ↓
Browser: getStudentById(pid)
      ↓
API Request: GET /api/Student/{pid}
      ↓
Response: {
  firstName: "Ramsewak",
  lastName: "Kumar",
  // ❌ photoPath missing - DETECTED
  // ❌ documents missing - DETECTED
}
      ↓
System: Check if photo is missing?
  └─ YES ❌ → Fetch it!
      ↓
Parallel Fetch 1:
GET /api/Student/{pid}/photo → { photoPath: "uploads/..." }

Parallel Fetch 2:
GET /api/Student/{pid}/documents → [{ documentType: "...", url: "..." }]
      ↓
Merge Results:
{
  firstName: "Ramsewak",
  lastName: "Kumar",
  photoPath: "uploads/photo.jpg",      ✅ ADDED
  documents: [{...}, {...}],           ✅ ADDED
}
      ↓
Frontend: Form displays with...
   Profile Photo Field
   ├─ Shows: [Photo Image Preview]
   └─ ✅ Student photo visible!

   Current Admission Documents
   ├─ Profile Photo Card
   ├─ Document Card 1
   ├─ Document Card 2
   └─ ✅ All documents visible!
```

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Browser                                                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ EditDataPage.tsx                                          │ │
│  │                                                            │ │
│  │  handleSearch() → getStudentById(pid)                     │ │
│  │       ↓                                                    │ │
│  │  mapStudentToFormData(studentData)                        │ │
│  │       ↓                                                    │ │
│  │  <PersonalDetailsSection data.profilePhotoUrl="{url}" />  │ │
│  │  <DocumentViewer documents={data.documents} />            │ │
│  └────────────────────────────────────────────────────────────┘ │
│         ↑                                                        │
│         │ Uses                                                   │
│         │                                                        │
│  ┌──────┴─────────────────────────────────────────────────────┐ │
│  │ services/api.ts                                           │ │
│  │                                                            │ │
│  │  getStudentById(pid)                                      │ │
│  │  ├─ GET /api/Student/{pid}                               │ │
│  │  ├─ Check: photoPath missing?                            │ │
│  │  │   └─ YES: Call getStudentProfilePhoto(pid)            │ │
│  │  ├─ Check: documents missing?                            │ │
│  │  │   └─ YES: Call getStudentDocuments(pid)               │ │
│  │  └─ Return merged studentData                            │ │
│  │                                                            │ │
│  │  getStudentProfilePhoto(pid) [NEW]                        │ │
│  │  ├─ Try GET /api/Student/{pid}/photo                     │ │
│  │  ├─ Try GET /api/Student/{pid}/profile-photo             │ │
│  │  ├─ Try GET /api/Student/{pid}/photopath                 │ │
│  │  └─ Return: { photoPath: "..." }                         │ │
│  │                                                            │ │
│  │  getStudentDocuments(pid)                                 │ │
│  │  └─ GET /api/Student/{pid}/documents                     │ │
│  │     Return: [{ documentType, url }]                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                    Backend API (.NET)

┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Backend                                                         │
│                                                                  │
│  GET /api/Student/{pid}                                         │
│  └─ Returns: Student object (may lack photo/documents)          │
│                                                                  │
│  GET /api/Student/{pid}/photo [Expected by fix]                 │
│  └─ Returns: { photoPath: "..." }                               │
│                                                                  │
│  GET /api/Student/{pid}/documents [Expected by fix]             │
│  └─ Returns: [{ documentType, url, ... }]                       │
│                                                                  │
│  GET /api/Student/{pid}/profile-photo [Alternative endpoint]    │
│  └─ Returns: { photoPath: "..." }                               │
│                                                                  │
│  GET /api/Student/{pid}/photopath [Alternative endpoint]        │
│  └─ Returns: { photoPath: "..." }                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow: Step by Step

### Step 1️⃣: User Initiates Search

```
User Input:
  PID: 7910a7fa-ccd9-49fa-9391-137b1fe01b6e
  Button: "Search"
         ↓
  setStudentId("7910a7fa-...")
  handleSearch() called
```

### Step 2️⃣: API Calls Main Endpoint

```
Frontend:
  const response = await getStudentById("7910a7fa-...")
         ↓
Backend:
  GET /api/Student/7910a7fa-ccd9-49fa-9391-137b1fe01b6e
         ↓
Response:
  HTTP 200 OK
  {
    "id": "...",
    "firstName": "Ramsewak",
    "lastName": "Kumar",
    "personalDetails": { ... },
    "addresses": [ ... ],
    // ❌ Notice: NO photoPath, NO documents
  }
```

### Step 3️⃣: Detect Missing Data

```
Frontend Logic:
  studentData = response.data

  if (!studentData.photoPath ||
      studentData.photoPath.trim() === '') {
    console.log('🖼️ Photo not found, fetching separately...')
    photoResponse = await getStudentProfilePhoto(pid)
    studentData.photoPath = photoResponse.data.photoPath
  }

  if (!studentData.documents ||
      studentData.documents.length === 0) {
    console.log('📄 Documents not found, fetching separately...')
    docsResponse = await getStudentDocuments(pid)
    studentData.documents = docsResponse.data
  }
```

### Step 4️⃣: Fetch Missing Photo

```
Frontend:
  getStudentProfilePhoto("7910a7fa-...")
         ↓
  Try #1: GET /api/Student/7910a7fa-.../photo
  Try #2: GET /api/Student/7910a7fa-.../profile-photo
  Try #3: GET /api/Student/7910a7fa-.../photopath
         ↓
Backend (one of above):
  HTTP 200 OK
  {
    "photoPath": "uploads/photos/ramsewak-kumar.jpg"
  }
         ↓
Merge:
  studentData.photoPath = "uploads/photos/ramsewak-kumar.jpg"
```

### Step 5️⃣: Fetch Missing Documents

```
Frontend:
  getStudentDocuments("7910a7fa-...")
         ↓
Backend:
  GET /api/Student/7910a7fa-.../documents
  HTTP 200 OK
  [
    {
      "documentType": "Passport",
      "url": "uploads/documents/passport.pdf",
      "uploadDate": "2024-01-15"
    },
    {
      "documentType": "Character Certificate",
      "url": "uploads/documents/certificate.pdf",
      "uploadDate": "2024-01-16"
    }
  ]
         ↓
Merge:
  studentData.documents = [...]
```

### Step 6️⃣: Map and Display

```
Complete studentData:
{
  firstName: "Ramsewak",
  lastName: "Kumar",
  photoPath: "uploads/photos/ramsewak-kumar.jpg",
  documents: [{...}, {...}]
}
         ↓
mapStudentToFormData(studentData)
         ↓
formData.personalDetails.profilePhotoUrl =
  "https://localhost:7257/uploads/photos/ramsewak-kumar.jpg"
         ↓
setFormData(formData)
         ↓
PersonalDetailsSection renders:
  Photo → <img src={profilePhotoUrl} />
         ↓
DocumentViewer renders:
  Documents → [Document Cards]
```

## Component Interaction

```
┌──────────────────────┐
│  EditDataPage        │
│  (Search & Display)  │
└──────────┬───────────┘
           │ Uses
           ↓
┌──────────────────────────────┐
│  PersonalDetailsSection      │
│  ├─ Receives profilePhotoUrl │
│  └─ Shows photo or upload    │
└──────────────────────────────┘

┌──────────────────────────────┐
│  DocumentViewer              │
│  ├─ Receives documents[]     │
│  └─ Shows document cards     │
└──────────────────────────────┘
```

## Console Log Output

When everything works:

```javascript
// User searches by PID
🔍 Searching for student: 7910a7fa-ccd9-49fa-9391-137b1fe01b6e
✓ Direct lookup found

// Check for missing data
🖼️ Photo not found in student data, fetching separately...
📄 Documents not found in student data, fetching separately...

// Fetch from endpoints
🖼️ Fetching profile photo for student: 7910a7fa-...
✓ Photo found at /api/Student/{id}/photo
📄 Fetching documents for student: 7910a7fa-...
✓ Documents fetched

// Merge results
✓ Photo merged into student data: uploads/photos/ramsewak-kumar.jpg
✓ Documents merged into student data: [...]

// Display data
🖼️ PHOTO RESOLUTION: {
  resolved_photoPath: "uploads/photos/ramsewak-kumar.jpg",
  resolved_profilePhotoUrl: "https://localhost:7257/uploads/photos/ramsewak-kumar.jpg",
  BACKEND_ORIGIN: "https://localhost:7257"
}

🔍 Student Data from API: {...}
✅ Mapped Form Data: {...}
```

## Error Scenarios

### Scenario 1: Photo endpoint doesn't exist

```
🖼️ Fetching profile photo for student: 7910a7fa-...
✓ Photo found at ... (tries all 3 endpoints)
⚠️ No photo endpoint found for student: 7910a7fa-...
// Returns gracefully, photo shows upload field
```

### Scenario 2: Documents endpoint doesn't exist

```
📄 Fetching documents for student: 7910a7fa-...
⚠️ Document fetch warning: 404 Not Found
// Returns empty array, no documents shown
```

### Scenario 3: Network error

```
🔍 Searching for student: 7910a7fa-...
❌ Network error: Request failed
// Displays error message, suggests checking backend
```

---

**All scenarios handled gracefully - App never crashes**
