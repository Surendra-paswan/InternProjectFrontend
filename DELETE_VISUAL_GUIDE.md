# Delete Process - Visual Guide

## User Interface Layout

### Screen 1: Search Interface

```
╔═══════════════════════════════════════════════════════════╗
║  Delete Student Record                                    ║
║  ⚠️ This action cannot be undone                          ║
╚═══════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────┐
│  Enter Student PID                                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Enter Student ID (PID)  [Search Button]             │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘

[If error or success message, displays here in colored box]
```

### Screen 2: Data Display (After Successful Search)

```
╔═══════════════════════════════════════════════════════════╗
║  Delete Student Record                                    ║
║  ⚠️ This action cannot be undone                          ║
╚═══════════════════════════════════════════════════════════╝

[Search Bar at top]

┌───────────────────────────────────┬───────────────────────────────────┐
│ Personal Details                  │ Contact Details                   │
│                                   │                                   │
│ PID: [value]                      │ Email: [value]                    │
│ First Name: [value]               │ Alternate Email: [value]          │
│ Middle Name: [value]              │ Primary Mobile: [value]           │
│ Last Name: [value]                │ Secondary Mobile: [value]         │
│ Date of Birth: [value]            │                                   │
│ Gender: [value]                   │                                   │
└───────────────────────────────────┴───────────────────────────────────┘

┌───────────────────────────────────┬───────────────────────────────────┐
│ Address (if available)            │ Citizenship                       │
│                                   │                                   │
│ Province: [value]                 │ Citizenship Number: [value]       │
│ District: [value]                 │ Issue Date: [value]               │
│ Municipality: [value]             │ Issue District: [value]           │
│ Ward: [value]                     │                                   │
└───────────────────────────────────┴───────────────────────────────────┘

┌───────────────────────────────────┬───────────────────────────────────┐
│ Academic Details (if available)   │ Profile Photo (if available)      │
│                                   │                                   │
│ Roll Number: [value]              │  ╔═════════════════╗             │
│ Registration Number: [value]      │  ║  [Photo Image]  ║             │
│ Academic Year: [value]            │  ║                 ║             │
│                                   │  ╚═════════════════╝             │
└───────────────────────────────────┴───────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│              [Proceed to Delete This Student Button]                 │
│                        (Red Button)                                   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

### Screen 3: Confirmation Dialog (After Clicking Delete Button)

```
╔═══════════════════════════════════════════════════════════╗
║  Delete Student Record                                    ║
║  ⚠️ This action cannot be undone                          ║
╚═══════════════════════════════════════════════════════════╝

[Search Bar and Previous Data visible but dimmed]

┌───────────────────────────────────────────────────────────┐
│                                                           │
│  ⚠️ Confirm Permanent Deletion                           │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  You are about to delete the record for:           │  │
│  │                                                     │  │
│  │  John Doe                                           │  │
│  │  PID: 12345                                         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  This will permanently delete all student data from      │
│  the database. This action CANNOT be undone.             │
│                                                           │
│  ┌──────────────────┬──────────────────┐                │
│  │ Yes, Delete      │                  │                │
│  │ Permanently      │ Cancel           │                │
│  │                  │                  │                │
│  │ (Red Button)     │ (Gray Button)    │                │
│  └──────────────────┴──────────────────┘                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Screen 4: Success Message (After Deletion)

```
╔═══════════════════════════════════════════════════════════╗
║  Delete Student Record                                    ║
║  ⚠️ This action cannot be undone                          ║
╚═══════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────┐
│ ✓ Student record deleted successfully!                   │
│ (Green success message box)                              │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  Enter Student PID                                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Enter Student ID (PID)  [Search Button]             │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘

[Form is reset, ready for next operation]
```

## Color Scheme

### Colors Used

- **Primary Gradient**: Purple to Blue (Search button)
- **Danger/Warning**: Red (#dc2626) - Delete buttons
- **Danger Hover**: Darker Red (#991b1b) - Delete button hover
- **Cancel**: Gray (#d1d5db) - Cancel button
- **Success**: Green - Success message background
- **Error**: Red - Error message background
- **Card Background**: Light Slate (#f8fafc)
- **Border**: Red with transparency - Confirmation dialog

### Button States

```
Search Button
├─ Normal: Purple → Blue gradient
└─ Hover: Box shadow effect
└─ Disabled: Reduced opacity

Delete Buttons
├─ Normal: Red (#dc2626)
├─ Hover: Darker Red
└─ Disabled: Reduced opacity

Cancel Button
├─ Normal: Gray (#d1d5db)
├─ Hover: Darker Gray
└─ Disabled: Reduced opacity
```

## Responsive Layout

### Mobile (< 768px)

```
All cards stack vertically
├─ Personal Details (full width)
├─ Contact Details (full width)
├─ Address (full width)
├─ Citizenship (full width)
├─ Academic Details (full width)
└─ Photo (full width)

[Full width button]
```

### Tablet & Desktop (≥ 768px)

```
Two-column grid layout
├─ Row 1: Personal Details | Contact Details
├─ Row 2: Address | Citizenship
├─ Row 3: Academic | Photo
└─ Full width: Button at bottom
```

## Error Message Display

### Search Error (No Record)

```
┌──────────────────────────────────────┐
│ ✗ No record found for PID: 99999     │
│   (Red background)                   │
└──────────────────────────────────────┘
```

### Validation Error (Empty PID)

```
┌──────────────────────────────────────────┐
│ ✗ Please enter a PID (Student ID)        │
│   (Red background)                       │
└──────────────────────────────────────────┘
```

### Fetch Error

```
┌──────────────────────────────────────────┐
│ ✗ Error fetching student data            │
│   (Red background)                       │
└──────────────────────────────────────────┘
```

## Success Message Display

```
┌──────────────────────────────────────────┐
│ ✓ Student record deleted successfully!   │
│   (Green background)                     │
└──────────────────────────────────────────┘
```

## Loading States

### While Searching

```
[Search Bar with "Searching..." button text and disabled state]
```

### While Deleting

```
[Delete button shows "Deleting..." text]
[Cancel button is disabled]
```

## Accessibility Features

- Clear labels for form inputs
- Descriptive button text
- Color + text for error/success messages (not color alone)
- Proper heading hierarchy (h1, h2, h3)
- Warning icon (⚠️) for danger actions
- Check mark (✓) for success
- All interactive elements have focus states
- Mobile responsive layout

## Keyboard Navigation

- Tab: Navigate through form and buttons
- Enter: Submit search, confirm delete
- Escape: Can be used to cancel (optional enhancement)
- Space: Activate buttons

## Screen Reader Text

All interactive elements have descriptive labels:

- Buttons describe their action
- Error messages clearly state the problem
- Success messages confirm completion
- Data cards have section headings

## Animation/Transition

- Buttons have smooth color transitions on hover
- Messages appear/disappear smoothly
- No disruptive animations
- Fast, responsive interactions
