import { test, expect } from '@playwright/test';
import { CreateUserPage } from '../pages/CreateUserPage';
import { UserListPage } from '../pages/UserListPage';

test.describe('Create User Page Tests', () => {
  let createUserPage;

  test.beforeEach(async ({ page }) => {
    createUserPage = new CreateUserPage(page);
    
    // Navigate to the page first, then clear localStorage
    await createUserPage.goto();
    await page.evaluate(() => localStorage.clear());
  });

  test('should display create user page correctly', async () => {
    await expect(createUserPage.nameInput).toBeVisible();
    await expect(createUserPage.emailInput).toBeVisible();
    await expect(createUserPage.roleSelect).toBeVisible();
    await expect(createUserPage.submitButton).toBeVisible();
    
    const title = await createUserPage.getTitle();
    expect(title).toBe('Create User');
  });

  test('should create a new user successfully', async ({ page }) => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'User'
    };
    
    await createUserPage.createUser(newUser);
    
    // Wait for success message
    const successMessage = await createUserPage.getSuccessMessage();
    expect(successMessage).toContain('User created successfully');
    
    // Wait for redirect to list page
    await page.waitForURL('**/list.html', { timeout: 3000 });
    
    // Verify user was added to the list
    const userListPage = new UserListPage(page);
    const isPresent = await userListPage.isUserPresent(newUser.name);
    expect(isPresent).toBe(true);
  });

  test('should fill form fields correctly', async () => {
    await createUserPage.nameInput.fill('John Smith');
    await createUserPage.emailInput.fill('john@example.com');
    await createUserPage.roleSelect.selectOption('Admin');
    
    const nameValue = await createUserPage.nameInput.inputValue();
    const emailValue = await createUserPage.emailInput.inputValue();
    const roleValue = await createUserPage.roleSelect.inputValue();
    
    expect(nameValue).toBe('John Smith');
    expect(emailValue).toBe('john@example.com');
    expect(roleValue).toBe('Admin');
  });

  test('should have correct role options', async ({ page }) => {
    const options = await page.locator('#role option').allTextContents();
    
    expect(options).toContain('Admin');
    expect(options).toContain('User');
    expect(options).toContain('Manager');
  });

  test('should validate required fields', async () => {
    // Click submit button without filling fields
    await createUserPage.submitButton.click();
    
    // HTML5 validation should prevent form submission
    const isOnCreatePage = await createUserPage.isDisplayed();
    expect(isOnCreatePage).toBe(true);
  });

  test('should cancel and return to list page', async ({ page }) => {
    await page.click('text=Cancel');
    
    await page.waitForURL('**/list.html');
    expect(page.url()).toContain('list.html');
  });

  test('should create multiple users', async ({ page }) => {
    const users = [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
      { name: 'Bob Wilson', email: 'bob@example.com', role: 'Manager' }
    ];
    
    for (const user of users) {
      await createUserPage.goto();
      await createUserPage.createUser(user);
      await page.waitForURL('**/list.html', { timeout: 3000 });
    }
    
    // Verify all users were added
    const userListPage = new UserListPage(page);
    const isAlicePresent = await userListPage.isUserPresent(users[0].name);
    const isBobPresent = await userListPage.isUserPresent(users[1].name);
    
    expect(isAlicePresent).toBe(true);
    expect(isBobPresent).toBe(true);
  });
});
