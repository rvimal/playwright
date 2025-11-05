# Application Flow Guide

This document explains how the web application works and the user flow.

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Application                          │
│                                                              │
│  ┌────────────┐      ┌─────────────┐      ┌──────────────┐ │
│  │   Login    │ ───> │  User List  │ ───> │ Create User  │ │
│  │   Page     │      │    Page     │      │    Page      │ │
│  └────────────┘      └─────────────┘      └──────────────┘ │
│       │                     │                      │         │
│       │                     │                      │         │
│       v                     v                      v         │
│  Authenticate          View/Delete            Add User       │
│                          Users                               │
└─────────────────────────────────────────────────────────────┘
```

## User Flow

### Flow 1: Login Flow

```
Start
  │
  v
Login Page (login.html)
  │
  ├─> Enter Username: admin
  ├─> Enter Password: admin123
  └─> Click Login Button
      │
      ├─> Valid Credentials? ─────> NO ──> Show Error Message
      │                                         │
      │                                         v
      │                                    Stay on Login Page
      │
      └─> YES
          │
          v
     Success Message
          │
          v
  Redirect to User List (list.html)
```

### Flow 2: User List Flow

```
User List Page (list.html)
  │
  ├─> View User Table
  │   └─> Display: ID, Name, Email, Role, Actions
  │
  ├─> Click "Create New User"
  │   └─> Navigate to Create User Page
  │
  ├─> Click "Edit" (shows alert - demo)
  │
  ├─> Click "Delete"
  │   ├─> Confirm Dialog
  │   ├─> YES ──> Remove User from List
  │   └─> NO ──> Stay on Page
  │
  └─> Click "Logout"
      └─> Navigate to Login Page
```

### Flow 3: Create User Flow

```
Create User Page (create-user.html)
  │
  ├─> Fill Form
  │   ├─> Enter Full Name
  │   ├─> Enter Email
  │   └─> Select Role (Admin/User/Manager)
  │
  ├─> Click "Create User"
  │   │
  │   ├─> Valid Data? ────> NO ──> Show Error Message
  │   │                                 │
  │   │                                 v
  │   │                          Stay on Form
  │   │
  │   └─> YES
  │       │
  │       v
  │   Success Message
  │       │
  │       v
  │   Save to LocalStorage
  │       │
  │       v
  │   Redirect to User List
  │
  └─> Click "Cancel"
      └─> Navigate to User List
```

## Data Flow

### Local Storage Structure

```javascript
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Admin"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "User"
    }
    // ... more users
  ]
}
```

## Page Components

### 1. Login Page Components

```
┌─────────────────────────────────────┐
│          Login Container            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │        Login Header           │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Username Input Field         │ │
│  │  [data-testid="username"]     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Password Input Field         │ │
│  │  [data-testid="password"]     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Login Button             │ │
│  │  [data-testid="login-button"] │ │
│  └───────────────────────────────┘ │
│                                     │
│  Error/Success Message Area        │
│                                     │
└─────────────────────────────────────┘
```

### 2. User List Page Components

```
┌─────────────────────────────────────────────────────┐
│                 User List Container                 │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  Header: "User List"  [Create] [Logout]    │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Table                                        │  │
│  │ ┌────┬──────┬────────┬──────┬──────────┐   │  │
│  │ │ ID │ Name │ Email  │ Role │ Actions  │   │  │
│  │ ├────┼──────┼────────┼──────┼──────────┤   │  │
│  │ │ 1  │ John │ john@  │Admin │[Edit][X] │   │  │
│  │ │ 2  │ Jane │ jane@  │User  │[Edit][X] │   │  │
│  │ └────┴──────┴────────┴──────┴──────────┘   │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. Create User Page Components

```
┌─────────────────────────────────────┐
│      Create User Container          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Header: "Create New User"    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Full Name Input              │ │
│  │  [data-testid="name-input"]   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Email Input                  │ │
│  │  [data-testid="email-input"]  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Role Select Dropdown         │ │
│  │  [data-testid="role-select"]  │ │
│  │  - Admin                      │ │
│  │  - User                       │ │
│  │  - Manager                    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌────────────┐  ┌──────────────┐ │
│  │   Create   │  │    Cancel    │ │
│  └────────────┘  └──────────────┘ │
│                                     │
│  Success/Error Message Area        │
│                                     │
└─────────────────────────────────────┘
```

## Test Automation Flow

### How Tests Interact with Application

```
Test File (*.spec.js)
      │
      v
Page Object (LoginPage.js, etc.)
      │
      v
Playwright Actions
      │
      v
Web Application (HTML files)
      │
      v
Browser Response
      │
      v
Assertions & Verification
      │
      v
Test Results
```

### Example Test Flow

```javascript
// Test: Login with valid credentials

1. Initialize Page Object
   loginPage = new LoginPage(page)

2. Navigate to Page
   await loginPage.goto()

3. Fill Credentials
   await loginPage.login('admin', 'admin123')

4. Verify Success
   expect(successMessage).toContain('Login successful')

5. Verify Redirect
   expect(url).toContain('list.html')
```

## State Management

### How Data Persists

```
User Creates New User
      │
      v
Form Submission
      │
      v
JavaScript Processes Data
      │
      v
Save to LocalStorage
      │
      v
Reload User List
      │
      v
Display Updated Data
```

### LocalStorage Operations

```javascript
// Save
localStorage.setItem('users', JSON.stringify(users));

// Retrieve
const users = JSON.parse(localStorage.getItem('users'));

// Clear
localStorage.clear();
```

## Security Notes

⚠️ **Important**: This is a demo application

- Credentials are hardcoded (for demo purposes)
- No backend authentication
- Data stored in browser LocalStorage
- Not suitable for production use

## Features Overview

### Login Page
✅ Form validation  
✅ Error handling  
✅ Success feedback  
✅ Automatic redirect  

### User List Page
✅ Dynamic table rendering  
✅ User data display  
✅ Delete functionality  
✅ Navigation controls  

### Create User Page
✅ Form validation  
✅ Role selection  
✅ Success feedback  
✅ Data persistence  

## Browser Compatibility

✅ Modern browsers (Chrome, Firefox, Safari, Edge)  
✅ Responsive design  
✅ Mobile-friendly  

---

This application demonstrates a complete user management flow suitable for learning Playwright automation testing.
