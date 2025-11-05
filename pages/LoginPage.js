import { BasePage } from './BasePage';

/**
 * Login Page Object
 * Represents the login page and its elements/actions
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.locator('#errorMessage');
    this.successMessage = page.locator('#successMessage');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.navigate('login.html');
  }

  /**
   * Perform login action
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
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
   * Get success message text
   * @returns {Promise<string>} Success message
   */
  async getSuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible' });
    return await this.successMessage.textContent();
  }

  /**
   * Check if login was successful (redirected to list page)
   * @returns {Promise<boolean>} True if on list page
   */
  async isLoginSuccessful() {
    await this.page.waitForURL('**/list.html', { timeout: 3000 });
    return this.page.url().includes('list.html');
  }

  /**
   * Verify login page is displayed
   * @returns {Promise<boolean>} True if on login page
   */
  async isDisplayed() {
    return await this.loginButton.isVisible();
  }
}
