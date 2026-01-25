# Two-Step Delete Process - Quick Reference

## Delete Flow Overview

```
┌─────────────────────────────────────┐
│  STEP 1: Search for Student         │
│  User enters PID → Click "Search"   │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Record Found?        │
    └────────┬─────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
    YES           NO
      │             │
      │      ┌──────────────────┐
      │      │ Show Error:      │
      │      │ "No record       │
      │      │ found for PID"   │
      │      └──────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  STEP 2: Review Student Data        │
│  Display all student information    │
│  in readable card format            │
│  [Proceed to Delete Button]         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  STEP 3: Confirm Deletion           │
│  Show warning dialog with:          │
│  - Student name & PID               │
│  - Delete warning message           │
│  [Yes, Delete] [Cancel]             │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
    DELETE        CANCEL
        │             │
        │      Return to Step 2
        │
        ▼
┌─────────────────────────────────────┐
│  STEP 4: Execute Deletion           │
│  Delete from database               │
│  Show success message               │
│  Reset form                         │
└─────────────────────────────────────┘
```

## Data Displayed in Step 2

### Card 1: Personal Details

- PID (Student ID)
- First Name
- Middle Name
- Last Name
- Date of Birth
- Gender

### Card 2: Contact Details

- Email
- Alternate Email
- Primary Mobile
- Secondary Mobile

### Card 3: Address (if available)

- Province
- District
- Municipality
- Ward Number

### Card 4: Citizenship

- Citizenship Number
- Issue Date
- Issue District

### Card 5: Academic Details (if available)

- Roll Number
- Registration Number
- Academic Year

### Card 6: Profile Photo (if available)

- Student photo

## Error Messages

| Scenario         | Error Message                         |
| ---------------- | ------------------------------------- |
| Empty PID        | Please enter a PID (Student ID)       |
| Non-existent PID | No record found for PID: [entered-id] |
| Fetch error      | Error fetching student data           |
| Delete error     | Error deleting student record         |

## Success Message

```
✓ Student record deleted successfully!
```

## UI Components

### Search Bar

- Label: "Enter Student PID"
- Placeholder: "Enter Student ID (PID)"
- Button: "Search" or "Searching..." (when loading)

### Data Display

- Grid layout (1 column on mobile, 2 columns on tablet+)
- Each section in a light gray card (bg-slate-50)
- Title bold and dark (font-semibold, text-slate-900)
- Fields organized as: Label | Value
- Red "Proceed to Delete This Student" button below

### Confirmation Dialog

- Red border and light red background
- Shows student name and PID
- Two buttons:
  - Red: "Yes, Delete Permanently"
  - Gray: "Cancel"
- Large red warning text
- "Deleting..." text while processing

## Key Features

✓ **Two-Step Confirmation**

- View data first, then confirm

✓ **Safe Error Handling**

- Clear messages for missing records

✓ **Comprehensive Data Display**

- All student information shown before deletion

✓ **Visual Warnings**

- Red buttons and borders emphasize danger
- Multiple warning messages

✓ **Cancel Option**

- Users can cancel at confirmation step

✓ **Success Feedback**

- Clear confirmation after deletion

## Implementation Details

### File Modified

- `src/pages/DeleteDataPage.tsx`

### Imports Added

- `getDocumentUrl` from `../config/api.config`

### API Methods Used

- `getStudentById(studentId)` - Fetch student data
- `deleteStudentById(studentId)` - Delete student record

### State Variables

- `studentId` - PID entered by user
- `studentData` - Student information fetched from API
- `loading` - Loading state during fetch/delete
- `error` - Error message display
- `success` - Success message display
- `confirmDelete` - Toggle confirmation dialog

## Testing Checklist

- [ ] Enter valid PID and verify data displays
- [ ] Verify all student cards show correct information
- [ ] Click "Proceed to Delete" and verify confirmation dialog
- [ ] Click "Cancel" and return to data display
- [ ] Click "Yes, Delete Permanently" and verify deletion
- [ ] Verify success message displays after deletion
- [ ] Enter invalid PID and verify error message
- [ ] Leave PID empty and verify validation error
- [ ] Test with PID containing special characters
- [ ] Verify photo displays correctly (if available)
- [ ] Verify photo fallback for missing images
