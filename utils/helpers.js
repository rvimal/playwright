/**
 * Test Helper Utilities
 */

/**
 * Generate random user data
 * @returns {object} Random user data
 */
export function generateRandomUser() {
  const timestamp = Date.now();
  return {
    name: `User ${timestamp}`,
    email: `user${timestamp}@example.com`,
    role: getRandomRole()
  };
}

/**
 * Get random role
 * @returns {string} Random role
 */
export function getRandomRole() {
  const roles = ['Admin', 'User', 'Manager'];
  return roles[Math.floor(Math.random() * roles.length)];
}

/**
 * Generate random email
 * @param {string} prefix - Email prefix
 * @returns {string} Random email
 */
export function generateRandomEmail(prefix = 'user') {
  const timestamp = Date.now();
  return `${prefix}${timestamp}@example.com`;
}

/**
 * Sleep/wait utility
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date to string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Clear browser storage
 * @param {Page} page - Playwright page object
 */
export async function clearBrowserStorage(page) {
  await page.goto('about:blank');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Take screenshot with timestamp
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
export async function takeTimestampedScreenshot(page, name) {
  const timestamp = Date.now();
  await page.screenshot({ 
    path: `screenshots/${name}_${timestamp}.png`,
    fullPage: true 
  });
}
