import { BasePage } from './BasePage';

/**
 * Create User Page Object
 * Represents the create user page and its elements/actions
 */
export class CreateUserPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.nameInput = page.getByTestId('name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleSelect = page.getByTestId('role-select');
    this.submitButton = page.getByTestId('submit-button');
    this.successMessage = page.locator('#successMessage');
    this.errorMessage = page.locator('#errorMessage');
  }

  /**
   * Navigate to create user page
   */
  async goto() {
    await this.navigate('create-user.html');
  }

  /**
   * Fill user form
   * @param {object} userData - User data object
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.role - User role
   */
  async fillUserForm(userData) {
    await this.nameInput.fill(userData.name);
    await this.emailInput.fill(userData.email);
    await this.roleSelect.selectOption(userData.role);
  }

  /**
   * Submit the form
   */
  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Create a new user
   * @param {object} userData - User data object
   */
  async createUser(userData) {
    await this.fillUserForm(userData);
    await this.submitForm();
  }

  /**
   * Get success message text
   * @returns {Promise<string>} Success message
   */
  async getSuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible' });
    return await this.successMessage.textContent();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent();
  }

  /**
   * Check if success message is displayed
   * @returns {Promise<boolean>} True if success message is visible
   */
  async isSuccessMessageDisplayed() {
    return await this.successMessage.isVisible();
  }

  /**
   * Verify create user page is displayed
   * @returns {Promise<boolean>} True if on create user page
   */
  async isDisplayed() {
    return await this.submitButton.isVisible();
  }

  /**
   * Wait for redirect to list page
   */
  async waitForRedirect() {
    await this.page.waitForURL('**/list.html', { timeout: 3000 });
  }
}
