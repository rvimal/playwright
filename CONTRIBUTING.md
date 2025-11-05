# Contributing Guide

Thank you for your interest in contributing to this Playwright automation project! This guide will help you get started.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Testing Guidelines](#testing-guidelines)
5. [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/playwright.git
cd playwright
```

3. Install dependencies:
```bash
npm install
npx playwright install
```

4. Run tests to verify setup:
```bash
npm test
```

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test additions or modifications

### 2. Make Changes
- Write clean, well-documented code
- Follow existing code patterns
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/login.spec.js

# Run in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### 4. Commit Changes
```bash
git add .
git commit -m "Brief description of changes"
```

Commit message format:
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test changes
- `refactor`: Code refactoring
- `style`: Code style changes

Example:
```
feat: Add user profile page and tests

- Created ProfilePage.js page object
- Added profile.spec.js test file
- Updated navigation to include profile link

Closes #123
```

## Code Style

### JavaScript/Node.js

1. **Use ES6+ features**
```javascript
// Use arrow functions
const login = async (username, password) => {
  // Implementation
};

// Use destructuring
const { username, password } = credentials;

// Use template literals
const message = `Welcome ${username}`;
```

2. **Use async/await**
```javascript
// Good
async function loginUser() {
  await loginPage.goto();
  await loginPage.login('user', 'pass');
}

// Avoid callbacks
```

3. **Consistent naming**
- Classes: PascalCase (`LoginPage`)
- Functions/variables: camelCase (`loginUser`, `userName`)
- Constants: UPPER_CASE (`VALID_CREDENTIALS`)
- Files: camelCase or kebab-case (`loginPage.js` or `login-page.js`)

### Page Objects

```javascript
export class PageName extends BasePage {
  constructor(page) {
    super(page);
    
    // Define locators
    this.element = page.locator('selector');
  }
  
  // Action methods
  async performAction() {
    // Implementation
  }
  
  // Verification methods
  async isElementVisible() {
    return await this.element.isVisible();
  }
}
```

### Test Files

```javascript
import { test, expect } from '@playwright/test';
import { PageObject } from '../pages/PageObject';

test.describe('Feature Name Tests', () => {
  let pageObject;
  
  test.beforeEach(async ({ page }) => {
    pageObject = new PageObject(page);
    // Setup
  });
  
  test('should perform expected action', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Testing Guidelines

### 1. Test Structure
Follow the AAA pattern:
```javascript
test('should create user successfully', async () => {
  // Arrange - Set up test data
  const user = { name: 'Test', email: 'test@example.com' };
  
  // Act - Perform action
  await createUserPage.createUser(user);
  
  // Assert - Verify result
  expect(await userListPage.isUserPresent(user.name)).toBe(true);
});
```

### 2. Test Independence
Each test should be independent:
```javascript
test.beforeEach(async ({ page }) => {
  // Clear state
  await page.evaluate(() => localStorage.clear());
});
```

### 3. Descriptive Names
```javascript
// Good
test('should display error message when login with invalid credentials', async () => {});

// Bad
test('test1', async () => {});
```

### 4. One Assertion Focus
Each test should focus on one thing:
```javascript
// Good
test('should display error for invalid password', async () => {
  await loginPage.login('user', 'wrong');
  expect(await loginPage.getErrorMessage()).toContain('Invalid');
});

// Avoid testing multiple unrelated things in one test
```

### 5. Use Test Data
```javascript
// Create in data/testData.js
export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com'
};

// Use in tests
import { TEST_USER } from '../data/testData';
```

## Pull Request Process

### 1. Update Your Branch
```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push Changes
```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request
- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Test addition

## Checklist
- [ ] Tests pass locally
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] Code follows project style
- [ ] No console errors

## Screenshots (if applicable)
```

### 4. Code Review
- Address reviewer feedback
- Update PR as needed
- Keep discussion professional and constructive

### 5. Merge
- Once approved, PR will be merged
- Delete your branch after merge

## Questions?

If you have questions:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

Thank you for contributing! 🎉
