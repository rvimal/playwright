import { test, expect } from '../fixtures/index.js';
import { beforeEachTest, afterEachTest, beforeAllTests, afterAllTests } from '../hooks/index.js';

beforeAllTests();
afterAllTests();

test.describe('Login Page Tests', () => {
  // Apply common test hooks
  beforeEachTest();
  afterEachTest();

  test('should display login page correctly', async ({ loginPage, testContext }) => {
    testContext.log('Testing login page display');
    
    await loginPage.goto();
    
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    const title = await loginPage.getTitle();
    expect(title).toBe('Login Page');
    
    testContext.addNote('Login page elements verified successfully');
  });

  test('should login successfully with valid credentials', async ({ loginPage, testData, testContext }) => {
    testContext.log('Testing successful login');
    
    // Use test data manager for credentials
    const credentials = await testData.getCredentials('admin');
    
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    
    // Wait for success message
    const successMessage = await loginPage.getSuccessMessage();
    expect(successMessage).toContain('Login successful');
    
    // Verify redirect to list page
    await loginPage.page.waitForURL('**/list.html');
    expect(loginPage.page.url()).toContain('list.html');
    
    testContext.addNote(`Successfully logged in with user: ${credentials.username}`);
  });

  test('should show error message with invalid credentials', async ({ loginPage, testContext }) => {
    testContext.log('Testing invalid credentials');
    
    await loginPage.goto();
    await loginPage.login('invalid', 'invalid');
    
    // Wait for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
    
    testContext.addNote('Error message displayed correctly for invalid credentials');
  });

  test('should validate required fields', async ({ loginPage, testContext }) => {
    testContext.log('Testing field validation');
    
    await loginPage.goto();
    
    // Click login button without filling fields
    await loginPage.loginButton.click();
    
    // HTML5 validation should prevent form submission
    const isOnLoginPage = await loginPage.isDisplayed();
    expect(isOnLoginPage).toBe(true);
    
    testContext.addNote('Field validation working correctly');
  });

  test('should fill username field correctly', async ({ loginPage, testContext }) => {
    await loginPage.goto();
    
    await loginPage.usernameInput.fill('testuser');
    const value = await loginPage.usernameInput.inputValue();
    expect(value).toBe('testuser');
    
    testContext.addNote('Username field functionality verified');
  });

  test('should fill password field correctly', async ({ loginPage, testContext }) => {
    await loginPage.goto();
    
    await loginPage.passwordInput.fill('testpass');
    const value = await loginPage.passwordInput.inputValue();
    expect(value).toBe('testpass');
    
    testContext.addNote('Password field functionality verified');
  });

  test('should handle user data generation', async ({ testData, loginPage, testContext }) => {
    testContext.log('Testing with generated user data');
    
    // Generate test user data
    const userData = await testData.generateUser();
    
    await loginPage.goto();
    await loginPage.usernameInput.fill(userData.name);
    await loginPage.passwordInput.fill('testpass123');
    
    testContext.addNote(`Used generated user data: ${userData.name} (${userData.email})`);
  });
});
