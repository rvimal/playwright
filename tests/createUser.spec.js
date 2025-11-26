import { test, expect } from '../fixtures/index.js';
import { HookManager } from '../hooks/hookManager.js';

// Apply user management hooks for this test suite
HookManager.applyUserManagementHooks();

test.describe('Create User Page Tests', () => {

  test('should display create user page correctly', async ({ createUserPage, testContext }) => {
    testContext.log('Testing create user page display');
    
    await createUserPage.goto();
    
    await expect(createUserPage.nameInput).toBeVisible();
    await expect(createUserPage.emailInput).toBeVisible();
    await expect(createUserPage.roleSelect).toBeVisible();
    await expect(createUserPage.submitButton).toBeVisible();
    
    const title = await createUserPage.getTitle();
    expect(title).toBe('Create User');
    
    testContext.addNote('Create user page elements verified successfully');
  });

  test('should create a new user successfully', async ({ createUserPage, userListPage, testData, testContext }) => {
    testContext.log('Testing successful user creation');
    
    // Generate unique test data
    const newUser = await testData.generateUser({
      name: 'Test User',
      email: 'test@example.com',
      role: 'User'
    });
    
    await createUserPage.goto();
    await createUserPage.createUser(newUser);
    
    // Wait for success message
    const successMessage = await createUserPage.getSuccessMessage();
    expect(successMessage).toContain('User created successfully');
    
    // Wait for redirect to list page
    await createUserPage.page.waitForURL('**/list.html', { timeout: 3000 });
    
    // Verify user was added to the list
    const isPresent = await userListPage.isUserPresent(newUser.name);
    expect(isPresent).toBe(true);
    
    testContext.addNote(`Successfully created user: ${newUser.name} (${newUser.email})`);
    // Test data cleanup will be handled automatically by TestDataManager
  });

  test('should fill form fields correctly', async ({ createUserPage, testData, testContext }) => {
    const userData = await testData.generateUser();
    
    await createUserPage.goto();
    await createUserPage.nameInput.fill(userData.name);
    await createUserPage.emailInput.fill(userData.email);
    await createUserPage.roleSelect.selectOption('Admin');
    
    const nameValue = await createUserPage.nameInput.inputValue();
    const emailValue = await createUserPage.emailInput.inputValue();
    const roleValue = await createUserPage.roleSelect.inputValue();
    
    expect(nameValue).toBe(userData.name);
    expect(emailValue).toBe(userData.email);
    expect(roleValue).toBe('Admin');
    
    testContext.addNote('Form field functionality verified');
  });

  test('should have correct role options', async ({ createUserPage, testContext }) => {
    await createUserPage.goto();
    
    const options = await createUserPage.page.locator('#role option').allTextContents();
    
    expect(options).toContain('Admin');
    expect(options).toContain('User');
    expect(options).toContain('Manager');
    
    testContext.addNote('Role options validated');
  });

  test('should validate required fields', async ({ createUserPage, testContext }) => {
    testContext.log('Testing field validation');
    
    await createUserPage.goto();
    
    // Click submit button without filling fields
    await createUserPage.submitButton.click();
    
    // HTML5 validation should prevent form submission
    const isOnCreatePage = await createUserPage.isDisplayed();
    expect(isOnCreatePage).toBe(true);
    
    testContext.addNote('Field validation working correctly');
  });

  test('should cancel and return to list page', async ({ createUserPage, testContext }) => {
    await createUserPage.goto();
    await createUserPage.page.click('text=Cancel');
    
    await createUserPage.page.waitForURL('**/list.html');
    expect(createUserPage.page.url()).toContain('list.html');
    
    testContext.addNote('Cancel functionality verified');
  });

  test('should create multiple users', async ({ createUserPage, userListPage, testData, testContext }, testInfo) => {
    testInfo.annotations.push({ type: 'data-driven', description: 'Multiple user creation test' });
    testContext.log('Testing multiple user creation');
    
    // Generate multiple test users
    const users = await Promise.all([
      testData.generateUser({ role: 'Admin' }),
      testData.generateUser({ role: 'Manager' })
    ]);
    
    for (const user of users) {
      await createUserPage.goto();
      await createUserPage.createUser(user);
      await createUserPage.page.waitForURL('**/list.html', { timeout: 3000 });
      
      // Mark each user for cleanup
      testInfo.annotations.push({
        type: 'test-data',
        description: `Created user: ${user.email}`
      });
    }
    
    // Verify all users were added
    const isFirstUserPresent = await userListPage.isUserPresent(users[0].name);
    const isSecondUserPresent = await userListPage.isUserPresent(users[1].name);
    
    expect(isFirstUserPresent).toBe(true);
    expect(isSecondUserPresent).toBe(true);
    
    testContext.addNote(`Successfully created ${users.length} users`);
  });

  test('should handle special characters in user data', async ({ createUserPage, testData, testContext }) => {
    testContext.log('Testing special characters handling');
    
    // Get test data with special characters
    const specialUser = await testData.getTestData('userWithSpecialChars');
    
    await createUserPage.goto();
    await createUserPage.createUser(specialUser);
    
    // Wait for success message
    const successMessage = await createUserPage.getSuccessMessage();
    expect(successMessage).toContain('User created successfully');
    
    testContext.addNote(`Successfully handled special characters: ${specialUser.name}`);
  });

  test('should validate email format', async ({ createUserPage, testData, testContext }) => {
    const invalidUser = await testData.getTestData('invalidUser');
    
    await createUserPage.goto();
    await createUserPage.nameInput.fill('Test User');
    await createUserPage.emailInput.fill(invalidUser.email); // Invalid email format
    await createUserPage.roleSelect.selectOption('User');
    await createUserPage.submitButton.click();
    
    // Should remain on create page due to validation
    const isOnCreatePage = await createUserPage.isDisplayed();
    expect(isOnCreatePage).toBe(true);
    
    testContext.addNote('Email validation working correctly');
  });
});
