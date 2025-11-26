/**
 * Hook Manager
 * 
 * Central place to manage all test hooks and their application.
 * Provides different hook combinations for different test scenarios.
 */

import { 
  beforeAllTests, 
  afterAllTests, 
  beforeEachTest, 
  afterEachTest,
  ConditionalHooks,
  RetryHooks 
} from './testHooks.js';

/**
 * Hook Manager - Central place to manage all test hooks
 */
export class HookManager {
  /**
   * Apply standard hooks to all tests (most common scenario)
   */
  static applyStandardHooks() {
    console.log('📋 HookManager: Applying standard test hooks (beforeAll, afterAll, beforeEach, afterEach)...');
    
    beforeAllTests();
    afterAllTests();
    beforeEachTest();
    afterEachTest();
    
    // Also apply retry logging by default
    RetryHooks.setupRetryLogging();
    
    console.log('✅ HookManager: Standard hooks applied successfully');
  }

  /**
   * Apply hooks specifically for authentication tests
   */
  static applyAuthHooks() {
    console.log('🔐 HookManager: Applying authentication-specific hooks...');
    
    this.applyStandardHooks();
    ConditionalHooks.forAuthenticatedTests();
    
    console.log('✅ HookManager: Authentication hooks applied successfully');
  }

  /**
   * Apply hooks for data-driven tests
   */
  static applyDataHooks() {
    console.log('📊 HookManager: Applying data-driven test hooks...');
    
    this.applyStandardHooks();
    ConditionalHooks.forDataDrivenTests();
    
    console.log('✅ HookManager: Data-driven hooks applied successfully');
  }

  /**
   * Apply hooks for performance tests
   */
  static applyPerformanceHooks() {
    console.log('⚡ HookManager: Applying performance test hooks...');
    
    this.applyStandardHooks();
    ConditionalHooks.forPerformanceTests();
    
    console.log('✅ HookManager: Performance hooks applied successfully');
  }

  /**
   * Apply all available hooks (for comprehensive test suites)
   */
  static applyAllHooks() {
    console.log('🚀 HookManager: Applying ALL test hooks...');
    
    this.applyStandardHooks();
    ConditionalHooks.forAuthenticatedTests();
    ConditionalHooks.forDataDrivenTests();
    ConditionalHooks.forPerformanceTests();
    
    console.log('✅ HookManager: All hooks applied successfully');
  }

  /**
   * Apply minimal hooks (only beforeEach/afterEach)
   */
  static applyMinimalHooks() {
    console.log('🎯 HookManager: Applying minimal test hooks (beforeEach/afterEach only)...');
    
    beforeEachTest();
    afterEachTest();
    
    console.log('✅ HookManager: Minimal hooks applied successfully');
  }

  /**
   * Apply hooks for login/authentication specific tests
   */
  static applyLoginHooks() {
    console.log('🔑 HookManager: Applying login-specific test hooks...');
    
    this.applyStandardHooks();
    ConditionalHooks.forAuthenticatedTests();
    
    console.log('✅ HookManager: Login hooks applied successfully');
  }

  /**
   * Apply hooks for user management tests (CRUD operations)
   */
  static applyUserManagementHooks() {
    console.log('👥 HookManager: Applying user management test hooks...');
    
    this.applyStandardHooks();
    ConditionalHooks.forDataDrivenTests();
    ConditionalHooks.forAuthenticatedTests();
    
    console.log('✅ HookManager: User management hooks applied successfully');
  }

  /**
   * Apply hooks for E2E workflow tests
   */
  static applyE2EHooks() {
    console.log('🔄 HookManager: Applying E2E workflow test hooks...');
    
    this.applyAllHooks(); // E2E tests typically need everything
    
    console.log('✅ HookManager: E2E hooks applied successfully');
  }

  /**
   * Get hook configuration info (for debugging)
   */
  static getHookInfo() {
    return {
      available: [
        'applyStandardHooks',
        'applyAuthHooks', 
        'applyDataHooks',
        'applyPerformanceHooks',
        'applyAllHooks',
        'applyMinimalHooks',
        'applyLoginHooks',
        'applyUserManagementHooks',
        'applyE2EHooks'
      ],
      recommended: {
        login: 'applyLoginHooks',
        userCRUD: 'applyUserManagementHooks',
        e2e: 'applyE2EHooks',
        performance: 'applyPerformanceHooks',
        datadriven: 'applyDataHooks'
      }
    };
  }
}