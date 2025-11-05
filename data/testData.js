/**
 * Test Data Constants
 */

// Valid credentials
export const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Invalid credentials
export const INVALID_CREDENTIALS = {
  username: 'invalid',
  password: 'invalid'
};

// Sample users
export const SAMPLE_USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User'
  }
];

// Test user data for creation
export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'User'
};

// User roles
export const USER_ROLES = ['Admin', 'User', 'Manager'];

// Timeouts
export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000
};

// URLs
export const URLS = {
  login: 'login.html',
  userList: 'list.html',
  createUser: 'create-user.html'
};
