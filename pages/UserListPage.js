import { BasePage } from './BasePage';

/**
 * User List Page Object
 * Represents the user list page and its elements/actions
 */
export class UserListPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.createUserButton = page.getByTestId('create-user-btn');
    this.userTable = page.locator('#userTable');
    this.userTableBody = page.locator('#userTableBody');
    this.emptyState = page.locator('#emptyState');
  }

  /**
   * Navigate to user list page
   */
  async goto() {
    await this.navigate('list.html');
  }

  /**
   * Click create user button
   */
  async clickCreateUser() {
    await this.createUserButton.click();
  }

  /**
   * Get all user rows
   * @returns {Promise<Array>} Array of user row elements
   */
  async getUserRows() {
    return await this.userTableBody.locator('tr').all();
  }

  /**
   * Get user count
   * @returns {Promise<number>} Number of users
   */
  async getUserCount() {
    const rows = await this.getUserRows();
    return rows.length;
  }

  /**
   * Delete user by ID
   * @param {number} userId - User ID to delete
   */
  async deleteUser(userId) {
    const deleteButton = this.page.getByTestId(`delete-user-${userId}`);
    
    // Accept the confirmation dialog
    this.page.on('dialog', dialog => dialog.accept());
    await deleteButton.click();
  }

  /**
   * Get user data by row index
   * @param {number} index - Row index (0-based)
   * @returns {Promise<object>} User data object
   */
  async getUserDataByIndex(index) {
    const row = this.userTableBody.locator('tr').nth(index);
    const cells = await row.locator('td').all();
    
    return {
      id: await cells[0].textContent(),
      name: await cells[1].textContent(),
      email: await cells[2].textContent(),
      role: await cells[3].textContent()
    };
  }

  /**
   * Check if empty state is displayed
   * @returns {Promise<boolean>} True if empty state is visible
   */
  async isEmptyStateDisplayed() {
    return await this.emptyState.isVisible();
  }

  /**
   * Verify user list page is displayed
   * @returns {Promise<boolean>} True if on user list page
   */
  async isDisplayed() {
    return await this.createUserButton.isVisible();
  }

  /**
   * Search for user by name
   * @param {string} name - User name to search for
   * @returns {Promise<boolean>} True if user is found
   */
  async isUserPresent(name) {
    const rows = await this.getUserRows();
    for (const row of rows) {
      const nameCell = await row.locator('td').nth(1).textContent();
      if (nameCell === name) {
        return true;
      }
    }
    return false;
  }
}
