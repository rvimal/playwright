/**
 * Test Hooks
 * 
 * Provides hooks that run before/after each test or test suite.
 * These can be imported and used in individual test files.
 */

import { test } from '../fixtures/index.js';

/**
 * Before each test hook
 * Common setup that should run before every test
 */
export function beforeEachTest() {
  test.beforeEach(async ({ page, testContext }, testInfo) => {
    // Log test start
    console.log(`🧪 Starting test: ${testInfo.title}`);
    
    // Clear browser state only if on a proper origin
    try {
      await page.context().clearCookies();
      
      // Navigate to base URL first to avoid localStorage security errors
      await page.goto('/');
      
      await page.evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (error) {
          console.log('Could not clear storage:', error.message);
        }
      });
    } catch (error) {
      console.log('Storage cleanup warning:', error.message);
    }
    
    // Set default viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Add test metadata
    testContext.addNote(`Test started at ${new Date().toISOString()}`);
    
    // Set up error handling
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Browser console error in ${testInfo.title}:`, msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      console.error(`Page error in ${testInfo.title}:`, error.message);
      testInfo.annotations.push({
        type: 'error',
        description: `Page error: ${error.message}`
      });
    });
  });
}

/**
 * After each test hook
 * Common cleanup that should run after every test
 */
export function afterEachTest() {
  test.afterEach(async ({ page, testContext }, testInfo) => {
    // Log test completion
    console.log(`✅ Completed test: ${testInfo.title} (${testInfo.status})`);
    
    // Take screenshot on failure
    if (testInfo.status === 'failed') {
      const screenshot = await page.screenshot({
        path: `test-results/failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true
      });
      
      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png'
      });
      
      // Also capture page HTML for debugging
      const html = await page.content();
      await testInfo.attach('page-html', {
        body: html,
        contentType: 'text/html'
      });
    }
    
    // Log performance metrics
    try {
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
        };
      });
      
      testContext.addNote(`Performance: Load ${metrics.loadTime}ms, DOM ${metrics.domContentLoaded}ms`);
    } catch (error) {
      // Performance metrics not available
    }
    
    // Clean up any test-specific data
    await cleanupTestData(testInfo);
  });
}

/**
 * Before all tests in a suite
 */
export function beforeAllTests() {
  test.beforeAll(async ({ browser }, testInfo) => {
    console.log(`🚀 Starting test suite: ${testInfo.project.name}`);
    
    // Setup suite-level data or configuration
    // This could include creating test users, setting up database state, etc.
  });
}

/**
 * After all tests in a suite
 */
export function afterAllTests() {
  test.afterAll(async ({ browser }, testInfo) => {
    console.log(`🏁 Completed test suite: ${testInfo.project.name}`);
    
    // Cleanup suite-level data
    // This could include removing test users, cleaning database, etc.
  });
}

/**
 * Helper function to clean up test-specific data
 */
async function cleanupTestData(testInfo) {
  try {
    // Extract any test IDs or data that needs cleanup from test annotations
    const testData = testInfo.annotations.filter(a => a.type === 'test-data');
    
    for (const data of testData) {
      console.log(`🧹 Cleaning up test data: ${data.description}`);
      // Implementation would clean up specific test data
    }
  } catch (error) {
    console.warn('Failed to cleanup test data:', error.message);
  }
}

/**
 * Conditional hooks that can be applied based on test conditions
 */
export class ConditionalHooks {
  /**
   * Apply hooks only for tests that require authentication
   */
  static forAuthenticatedTests() {
    test.beforeEach(async ({ page }, testInfo) => {
      if (testInfo.title.toLowerCase().includes('authenticated') || 
          testInfo.annotations.some(a => a.type === 'auth-required')) {
        console.log('🔐 Setting up authentication for test');
        
        // Additional auth setup
        await page.goto('/login');
        // Could perform login here or set auth state
      }
    });
  }

  /**
   * Apply hooks for tests that work with specific test data
   */
  static forDataDrivenTests() {
    test.beforeEach(async ({ testData }, testInfo) => {
      if (testInfo.annotations.some(a => a.type === 'data-driven')) {
        console.log('📊 Setting up data for data-driven test');
        
        // Setup specific test data
        const testUsers = await testData.getTestData('bulkUsers');
        testInfo.annotations.push({
          type: 'test-data',
          description: `Created ${testUsers.length} test users`
        });
      }
    });
  }

  /**
   * Apply hooks for performance-sensitive tests
   */
  static forPerformanceTests() {
    test.beforeEach(async ({ page }, testInfo) => {
      if (testInfo.annotations.some(a => a.type === 'performance')) {
        console.log('⚡ Setting up performance monitoring');
        
        // Enable performance tracking
        await page.addInitScript(() => {
          window.performance.mark('test-start');
        });
      }
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.annotations.some(a => a.type === 'performance')) {
        // Collect performance metrics
        const metrics = await page.evaluate(() => {
          window.performance.mark('test-end');
          window.performance.measure('test-duration', 'test-start', 'test-end');
          
          return {
            testDuration: window.performance.getEntriesByName('test-duration')[0]?.duration,
            navigationTiming: performance.getEntriesByType('navigation')[0]
          };
        });
        
        testInfo.annotations.push({
          type: 'performance-result',
          description: `Test duration: ${Math.round(metrics.testDuration)}ms`
        });
      }
    });
  }
}

/**
 * Retry hooks for handling flaky tests
 */
export class RetryHooks {
  static setupRetryLogging() {
    test.beforeEach(async ({}, testInfo) => {
      if (testInfo.retry > 0) {
        console.log(`🔄 Retrying test: ${testInfo.title} (attempt ${testInfo.retry + 1})`);
      }
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status === 'failed' && testInfo.retry < testInfo.project.retries) {
        console.log(`❌ Test failed, will retry: ${testInfo.title}`);
        
        // Take screenshot before retry
        const screenshot = await page.screenshot({
          path: `test-results/retry-${testInfo.retry}-${testInfo.title.replace(/\s+/g, '-')}.png`
        });
        
        await testInfo.attach(`retry-${testInfo.retry}-screenshot`, {
          body: screenshot,
          contentType: 'image/png'
        });
      }
    });
  }
}