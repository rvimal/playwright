# Best Practices Guide

This document outlines the best practices implemented in this Playwright automation project.

## 1. Page Object Model (POM)

### Why POM?
- Improves code maintainability
- Reduces code duplication
- Makes tests more readable
- Easier to update when UI changes

### Implementation
```javascript
// pages/LoginPage.js
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
  }
  
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

## 2. Test Organization

### Use Descriptive Test Names
```javascript
test('should login successfully with valid credentials', async ({ page }) => {
  // Test implementation
});
```

### Group Related Tests
```javascript
test.describe('Login Page Tests', () => {
  test('test 1', async () => {});
  test('test 2', async () => {});
});
```

### Use Hooks for Setup/Teardown
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('login.html');
});
```

## 3. Locator Strategy

### Prefer Test IDs
```html
<button data-testid="login-button">Login</button>
```

```javascript
page.getByTestId('login-button')
```

### Use Playwright's Built-in Locators
```javascript
page.getByRole('button', { name: 'Login' })
page.getByText('Welcome')
page.getByLabel('Username')
```

### Avoid Brittle Selectors
❌ Bad:
```javascript
page.locator('div > div > button:nth-child(2)')
```

✅ Good:
```javascript
page.getByTestId('submit-button')
```

## 4. Wait Strategies

### Auto-waiting
Playwright automatically waits for elements to be actionable:
```javascript
await page.click('button'); // Waits automatically
```

### Explicit Waits
```javascript
await page.waitForSelector('#element');
await page.waitForURL('**/success');
await page.waitForLoadState('networkidle');
```

## 5. Error Handling

### Screenshots on Failure
Configured in `playwright.config.js`:
```javascript
screenshot: 'only-on-failure'
```

### Videos on Failure
```javascript
video: 'retain-on-failure'
```

### Trace Collection
```javascript
trace: 'on-first-retry'
```

## 6. Test Data Management

### Centralized Test Data
```javascript
// data/testData.js
export const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};
```

### Use in Tests
```javascript
import { VALID_CREDENTIALS } from '../data/testData';

await loginPage.login(
  VALID_CREDENTIALS.username, 
  VALID_CREDENTIALS.password
);
```

## 7. Configuration

### Environment-based Configuration
```javascript
// playwright.config.js
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

### Multiple Browser Support
```javascript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
]
```

## 8. Parallel Execution

### Enable Parallel Tests
```javascript
fullyParallel: true,
workers: process.env.CI ? 1 : undefined,
```

### Isolate Test Data
```javascript
test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});
```

## 9. Reporting

### Multiple Report Formats
```javascript
reporter: [
  ['html', { outputFolder: 'playwright-report' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
]
```

## 10. CI/CD Integration

### Jenkins Pipeline
- Automatic browser installation
- Parameterized builds
- Artifact archiving
- Report generation

### Best Practices for CI
- Use retry mechanism
- Reduce parallel workers
- Archive test results
- Generate reports

## 11. Code Reusability

### Base Page Object
```javascript
export class BasePage {
  async navigate(path) {
    await this.page.goto(path);
  }
  
  async getTitle() {
    return await this.page.title();
  }
}
```

### Helper Functions
```javascript
export function generateRandomUser() {
  return {
    name: `User ${Date.now()}`,
    email: `user${Date.now()}@example.com`
  };
}
```

## 12. Maintenance

### Regular Updates
- Keep Playwright updated
- Update browser versions
- Review and refactor tests

### Documentation
- Document complex test scenarios
- Keep README up to date
- Add comments where necessary

## 13. Security

### Avoid Hardcoding Credentials
```javascript
// Use environment variables
const username = process.env.TEST_USERNAME || 'admin';
```

### Don't Commit Secrets
```
# .gitignore
.env
.env.local
```

## Summary

Following these best practices will help you:
- ✅ Write maintainable tests
- ✅ Reduce flakiness
- ✅ Improve test execution speed
- ✅ Better debugging capabilities
- ✅ Easier collaboration
- ✅ Scalable test suite

For more information, visit the [Playwright Best Practices](https://playwright.dev/docs/best-practices) documentation.
