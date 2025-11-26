/**
 * Base fixtures for Playwright tests
 * 
 * This file contains fundamental fixtures that provide common functionality
 * across all tests including authentication, test data, and configuration.
 */

import { test as base } from '@playwright/test';
import { TestDataManager } from './data/testDataManager.js';
import { ConfigManager } from '../utils/configManager.js';

// Define base fixtures
export const test = base.extend({
  /**
   * Test data fixture - provides access to test data management
   */
  testData: async ({}, use) => {
    const testDataManager = new TestDataManager();
    await testDataManager.initialize();
    
    await use(testDataManager);
    
    // Cleanup test data after test
    await testDataManager.cleanup();
  },

  /**
   * Configuration fixture - provides access to environment configuration
   */
  config: async ({}, use) => {
    const configManager = new ConfigManager();
    await use(configManager);
  },

  /**
   * Authenticated page fixture - provides a page with user already logged in
   */
  authenticatedPage: async ({ page, testData }, use) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Get test credentials
    const credentials = await testData.getCredentials('admin');
    
    // Perform login
    await page.getByTestId('username').fill(credentials.username);
    await page.getByTestId('password').fill(credentials.password);
    await page.getByTestId('login-button').click();
    
    // Wait for successful login
    await page.waitForURL('**/dashboard');
    
    await use(page);
  },

  /**
   * Fresh page fixture - provides a clean page with cleared storage
   */
  freshPage: async ({ page }, use) => {
    // Navigate to base URL first to establish proper origin
    await page.goto('/');
    
    // Clear all storage
    await page.context().clearCookies();
    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.log('Could not clear storage:', error.message);
      }
    });
    
    await use(page);
  },

  /**
   * Test context fixture - provides test metadata and utilities
   */
  testContext: async ({ page }, use, testInfo) => {
    const context = {
      testName: testInfo.title,
      testFile: testInfo.file,
      project: testInfo.project.name,
      retry: testInfo.retry,
      
      // Utility methods
      takeScreenshot: async (name) => {
        const screenshot = await page.screenshot({
          path: `test-results/${testInfo.title}-${name}.png`,
          fullPage: true
        });
        await testInfo.attach(`screenshot-${name}`, {
          body: screenshot,
          contentType: 'image/png'
        });
        return screenshot;
      },
      
      log: (message) => {
        console.log(`[${testInfo.title}] ${message}`);
      },
      
      addNote: (note) => {
        testInfo.annotations.push({ type: 'note', description: note });
      }
    };
    
    await use(context);
  },

  /**
   * API context fixture - provides authenticated API context
   */
  apiContext: async ({ playwright, testData }, use) => {
    const credentials = await testData.getCredentials('api');
    
    const apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${credentials.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    await use(apiContext);
    
    await apiContext.dispose();
  }
});

export { expect } from '@playwright/test';