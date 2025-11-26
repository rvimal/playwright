/**
 * Page Object Fixtures
 * 
 * Provides fixtures for page objects, making them available as dependencies
 * in tests. This simplifies test code and ensures proper page object lifecycle.
 */

import { test as base } from '../base.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { CreateUserPage } from '../../pages/CreateUserPage.js';
import { UserListPage } from '../../pages/UserListPage.js';
import { BasePage } from '../../pages/BasePage.js';

export const test = base.extend({
  /**
   * Base page fixture - provides access to common page functionality
   */
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  /**
   * Login page fixture - provides LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Create User page fixture - provides CreateUserPage instance
   */
  createUserPage: async ({ page }, use) => {
    const createUserPage = new CreateUserPage(page);
    await use(createUserPage);
  },

  /**
   * User List page fixture - provides UserListPage instance
   */
  userListPage: async ({ page }, use) => {
    const userListPage = new UserListPage(page);
    await use(userListPage);
  },

  /**
   * Authenticated login page - provides login page with user already logged in
   */
  authenticatedLoginPage: async ({ authenticatedPage }, use) => {
    const loginPage = new LoginPage(authenticatedPage);
    await use(loginPage);
  },

  /**
   * All pages fixture - provides access to all page objects at once
   */
  pages: async ({ page }, use) => {
    const pages = {
      base: new BasePage(page),
      login: new LoginPage(page),
      createUser: new CreateUserPage(page),
      userList: new UserListPage(page)
    };

    await use(pages);
  },

  /**
   * Navigation fixture - provides common navigation utilities
   */
  navigation: async ({ page, basePage }, use) => {
    const navigation = {
      async goToLogin() {
        await page.goto('/login');
        return new LoginPage(page);
      },

      async goToCreateUser() {
        await page.goto('/create-user');
        return new CreateUserPage(page);
      },

      async goToUserList() {
        await page.goto('/list');
        return new UserListPage(page);
      },

      async goToDashboard() {
        await page.goto('/dashboard');
        return basePage;
      },

      async navigateWithAuth(path) {
        // Ensure user is authenticated before navigation
        const isLoggedIn = await basePage.isUserLoggedIn();
        if (!isLoggedIn) {
          await this.goToLogin();
          // Would need to implement login logic here
        }
        await page.goto(path);
      }
    };

    await use(navigation);
  },

  /**
   * Page factory fixture - creates page objects dynamically
   */
  pageFactory: async ({ page }, use) => {
    const factory = {
      createPage(PageClass, pageInstance = page) {
        return new PageClass(pageInstance);
      },

      getLoginPage(pageInstance = page) {
        return new LoginPage(pageInstance);
      },

      getCreateUserPage(pageInstance = page) {
        return new CreateUserPage(pageInstance);
      },

      getUserListPage(pageInstance = page) {
        return new UserListPage(pageInstance);
      },

      getBasePage(pageInstance = page) {
        return new BasePage(pageInstance);
      }
    };

    await use(factory);
  }
});

export { expect } from '@playwright/test';