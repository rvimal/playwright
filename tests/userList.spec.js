import { test, expect } from '../fixtures/index.js';
import { HookManager } from '../hooks/hookManager.js';

// Apply user management hooks for this test suite
HookManager.applyUserManagementHooks();

test.describe('User List Page Tests', () => {

  test('should display user list page correctly', async ({ userListPage, testContext }) => {
    testContext.log('Testing user list page display');
    
    await userListPage.goto();
    await userListPage.page.waitForLoadState('domcontentloaded');
    
    await expect(userListPage.createUserButton).toBeVisible();
    
    const title = await userListPage.getTitle();
    expect(title).toBe('User List');
    
    testContext.addNote('User list page elements verified successfully');
  });

  test('should display default users', async ({ userListPage, testContext }) => {
    await userListPage.goto();
    
    const userCount = await userListPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
    
    testContext.addNote(`Found ${userCount} default users`);
  });

  test('should navigate to create user page', async ({ userListPage, testContext }) => {
    await userListPage.goto();
    await userListPage.clickCreateUser();
    
    await userListPage.page.waitForURL('**/create-user.html');
    expect(userListPage.page.url()).toContain('create-user.html');
    
    testContext.addNote('Navigation to create user page verified');
  });

  test('should display user data correctly', async ({ userListPage, testContext }) => {
    await userListPage.goto();
    
    const userData = await userListPage.getUserDataByIndex(0);
    
    expect(userData.id).toBeTruthy();
    expect(userData.name).toBeTruthy();
    expect(userData.email).toBeTruthy();
    expect(userData.role).toBeTruthy();
    
    testContext.addNote(`User data verified: ${userData.name}`);
  });

  test('should delete a user', async ({ userListPage, testContext }) => {
    await userListPage.goto();
    
    const initialCount = await userListPage.getUserCount();
    
    // Delete the first user (ID 1)
    await userListPage.deleteUser(1);
    
    // Wait for the page to update
    await userListPage.page.waitForTimeout(500);
    
    const finalCount = await userListPage.getUserCount();
    expect(finalCount).toBe(initialCount - 1);
    
    testContext.addNote(`Successfully deleted user. Count changed from ${initialCount} to ${finalCount}`);
  });

  test('should search for user by name', async ({ userListPage, testContext }) => {
    await userListPage.goto();
    
    const isPresent = await userListPage.isUserPresent('John Doe');
    expect(isPresent).toBe(true);
    
    testContext.addNote('User search functionality verified');
  });

  test('should have correct table headers', async ({ userListPage, testContext }) => {
    await userListPage.goto();
    
    const headers = await userListPage.page.locator('thead th').allTextContents();
    
    expect(headers).toContain('ID');
    expect(headers).toContain('Name');
    expect(headers).toContain('Email');
    expect(headers).toContain('Role');
    expect(headers).toContain('Actions');
  });
});
