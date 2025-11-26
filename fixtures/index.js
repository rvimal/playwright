/**
 * Combined fixtures that include both base fixtures and page fixtures
 * 
 * This is the main export that tests should import to get all fixtures.
 */

import { test as pageTest } from './pages/pageFixtures.js';

export const test = pageTest;
export { expect } from '@playwright/test';