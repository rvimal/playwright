import { test, expect } from '@playwright/test';
import { UserListPage } from '../pages/UserListPage';

test.describe('User List Page Tests', () => {
  let userListPage;

  test.beforeEach(async ({ page }) => {
    userListPage = new UserListPage(page);
    
    // Navigate to the page first, then clear localStorage
    await userListPage.goto();
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display user list page correctly', async () => {
    await expect(userListPage.createUserButton).toBeVisible();
    
    const title = await userListPage.getTitle();
    expect(title).toBe('User List');
  });

  test('should display default users', async () => {
    const userCount = await userListPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
  });

  test('should navigate to create user page', async ({ page }) => {
    await userListPage.clickCreateUser();
    
    await page.waitForURL('**/create-user.html');
    expect(page.url()).toContain('create-user.html');
  });

  test('should display user data correctly', async () => {
    const userData = await userListPage.getUserDataByIndex(0);
    
    expect(userData.id).toBeTruthy();
    expect(userData.name).toBeTruthy();
    expect(userData.email).toBeTruthy();
    expect(userData.role).toBeTruthy();
  });

  test('should delete a user', async ({ page }) => {
    const initialCount = await userListPage.getUserCount();
    
    // Delete the first user (ID 1)
    await userListPage.deleteUser(1);
    
    // Wait for the page to update
    await page.waitForTimeout(500);
    
    const finalCount = await userListPage.getUserCount();
    expect(finalCount).toBe(initialCount - 1);
  });

  test('should search for user by name', async () => {
    const isPresent = await userListPage.isUserPresent('John Doe');
    expect(isPresent).toBe(true);
  });

  test('should have correct table headers', async ({ page }) => {
    const headers = await page.locator('thead th').allTextContents();
    
    expect(headers).toContain('ID');
    expect(headers).toContain('Name');
    expect(headers).toContain('Email');
    expect(headers).toContain('Role');
    expect(headers).toContain('Actions');
  });
});
