import { test, expect } from '../fixtures/index.js';
import { HookManager } from '../hooks/hookManager.js';

// Apply E2E workflow hooks for this comprehensive test suite
HookManager.applyE2EHooks();

test.describe('End-to-End User Journey', () => {

  test('complete user flow - login, view list, create user, delete user', async ({ pages, testData, testContext }, testInfo) => {
    testContext.log('Starting complete user management workflow');
    testInfo.annotations.push({ type: 'data-driven', description: 'End-to-end workflow test' });
    
    // Step 1: Login
    const credentials = await testData.getCredentials('admin');
    await pages.login.goto();
    await pages.login.login(credentials.username, credentials.password);
    
    // Verify successful login and redirect
    await pages.login.page.waitForURL('**/list.html');
    expect(pages.login.page.url()).toContain('list.html');
    testContext.addNote('Login successful');
    
    // Step 2: View user list
    const initialUserCount = await pages.userList.getUserCount();
    expect(initialUserCount).toBeGreaterThan(0);
    testContext.addNote(`Initial user count: ${initialUserCount}`);
    
    // Step 3: Navigate to create user page
    await pages.userList.clickCreateUser();
    await pages.login.page.waitForURL('**/create-user.html');
    
    // Step 4: Create new user
    const newUser = await testData.generateUser({
      name: `E2E Test User`,
      role: 'User'
    });
    
    await pages.createUser.createUser(newUser);
    
    // Verify success message
    const successMessage = await createUserPage.getSuccessMessage();
    expect(successMessage).toContain('User created successfully');
    
    // Wait for redirect back to list
    await page.waitForURL('**/list.html');
    
    // Step 5: Verify user was added
    const updatedUserCount = await userListPage.getUserCount();
    expect(updatedUserCount).toBe(initialUserCount + 1);
    
    // Verify new user is present in the list
    const isPresent = await userListPage.isUserPresent(newUser.name);
    expect(isPresent).toBe(true);
    
    // Step 6: Delete the newly created user
    // Get the user data to find the ID
    let userId;
    const rows = await userListPage.getUserRows();
    for (let i = 0; i < rows.length; i++) {
      const userData = await userListPage.getUserDataByIndex(i);
      if (userData.name === newUser.name) {
        userId = userData.id;
        break;
      }
    }
    
    if (userId) {
      await userListPage.deleteUser(userId);
      await page.waitForTimeout(500);
      
      // Verify user was deleted
      const finalUserCount = await userListPage.getUserCount();
      expect(finalUserCount).toBe(initialUserCount);
    }
  });

  test('create multiple users and verify all are listed', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await page.waitForURL('**/list.html');
    
    const userListPage = new UserListPage(page);
    const createUserPage = new CreateUserPage(page);
    
    const usersToCreate = [
      { name: 'User A', email: 'usera@example.com', role: 'Admin' },
      { name: 'User B', email: 'userb@example.com', role: 'User' },
      { name: 'User C', email: 'userc@example.com', role: 'Manager' }
    ];
    
    for (const user of usersToCreate) {
      await userListPage.clickCreateUser();
      await page.waitForURL('**/create-user.html');
      
      await createUserPage.createUser(user);
      await page.waitForURL('**/list.html', { timeout: 3000 });
    }
    
    // Verify all users are present
    for (const user of usersToCreate) {
      const isPresent = await userListPage.isUserPresent(user.name);
      expect(isPresent).toBe(true);
    }
  });
});
