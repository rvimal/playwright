import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Page Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page correctly', async () => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    const title = await loginPage.getTitle();
    expect(title).toBe('Login Page');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login('admin', 'admin123');
    
    // Wait for success message
    const successMessage = await loginPage.getSuccessMessage();
    expect(successMessage).toContain('Login successful');
    
    // Verify redirect to list page
    await page.waitForURL('**/list.html');
    expect(page.url()).toContain('list.html');
  });

  test('should show error message with invalid credentials', async () => {
    await loginPage.login('invalid', 'invalid');
    
    // Wait for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
  });

  test('should validate required fields', async () => {
    // Click login button without filling fields
    await loginPage.loginButton.click();
    
    // HTML5 validation should prevent form submission
    const isOnLoginPage = await loginPage.isDisplayed();
    expect(isOnLoginPage).toBe(true);
  });

  test('should fill username field correctly', async () => {
    await loginPage.usernameInput.fill('testuser');
    const value = await loginPage.usernameInput.inputValue();
    expect(value).toBe('testuser');
  });

  test('should fill password field correctly', async () => {
    await loginPage.passwordInput.fill('testpass');
    const value = await loginPage.passwordInput.inputValue();
    expect(value).toBe('testpass');
  });
});
