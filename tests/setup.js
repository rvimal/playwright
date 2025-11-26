/**
 * Global Test Setup
 * 
 * This file is automatically loaded by Playwright before running tests.
 * It applies standard hooks to all test suites by default.
 */

import { HookManager } from '../hooks/hookManager.js';

// Apply standard hooks globally for all test suites
// This ensures consistent behavior across all tests
console.log('🌟 Global Setup: Initializing standard test hooks for all test suites...');

// Note: We apply minimal hooks here to avoid conflicts
// Individual test files can apply more specific hooks as needed
HookManager.applyMinimalHooks();

console.log('🌟 Global Setup: Standard hooks initialized globally');

// Export for use in individual test files if needed
export { HookManager };