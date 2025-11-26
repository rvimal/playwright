/**
 * Global Setup Hook
 * 
 * Runs once before all tests. Use this for global initialization
 * such as starting servers, setting up databases, or global configuration.
 */

import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('🚀 Starting global test setup...');

  try {
    // Start the application server if needed
    await startApplicationServer();
    
    // Verify application is accessible
    await verifyApplicationHealth();
    
    // Setup test database or reset state
    await setupTestDatabase();
    
    // Create global test data
    await createGlobalTestData();
    
    // Warm up the application
    await warmupApplication();
    
    console.log('✅ Global setup completed successfully');
    
    // Return any data that needs to be passed to tests
    return {
      serverUrl: process.env.BASE_URL || 'http://localhost:3000',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

/**
 * Start application server if not running
 */
async function startApplicationServer() {
  console.log('📡 Checking application server...');
  
  try {
    // Check if server is already running
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is already running');
      return;
    }
  } catch (error) {
    console.log('🔄 Server not running, attempting to start...');
  }

  // Start server using npm script
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('npm', ['start'], {
      detached: true,
      stdio: 'ignore'
    });

    // Wait for server to be ready
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:3000');
        if (response.ok) {
          console.log('✅ Server started successfully');
          resolve();
        } else {
          reject(new Error('Server not responding'));
        }
      } catch (error) {
        reject(error);
      }
    }, 3000);

    serverProcess.on('error', reject);
  });
}

/**
 * Verify application health and accessibility
 */
async function verifyApplicationHealth() {
  console.log('🏥 Verifying application health...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Check main page loads
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check login page loads
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Check critical elements exist
    const loginButton = page.getByTestId('login-button');
    if (!(await loginButton.isVisible())) {
      throw new Error('Login page not functioning properly');
    }
    
    console.log('✅ Application health check passed');
  } catch (error) {
    console.error('❌ Application health check failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Setup test database or reset application state
 */
async function setupTestDatabase() {
  console.log('🗄️ Setting up test database...');
  
  try {
    // Reset localStorage for clean state
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await browser.close();
    
    console.log('✅ Database setup completed');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

/**
 * Create global test data that will be used across tests
 */
async function createGlobalTestData() {
  console.log('📋 Creating global test data...');
  
  try {
    // Create admin user if needed
    await ensureAdminUserExists();
    
    // Create sample test data
    await createSampleUsers();
    
    console.log('✅ Global test data created');
  } catch (error) {
    console.error('❌ Failed to create global test data:', error);
    // Don't fail setup for this - tests can create their own data
  }
}

/**
 * Ensure admin user exists for testing
 */
async function ensureAdminUserExists() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000/login');
    
    // Try to login with admin credentials
    await page.getByTestId('username').fill(process.env.ADMIN_USERNAME || 'admin');
    await page.getByTestId('password').fill(process.env.ADMIN_PASSWORD || 'admin123');
    await page.getByTestId('login-button').click();
    
    // If login successful, admin exists
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    console.log('✅ Admin user verified');
    
  } catch (error) {
    console.log('⚠️ Admin user may not exist or credentials incorrect');
    // Could implement admin user creation here if needed
  } finally {
    await browser.close();
  }
}

/**
 * Create sample users for testing
 */
async function createSampleUsers() {
  // Implementation would create sample users
  // This could be done via API calls or UI automation
  console.log('📝 Sample users setup (implementation pending)');
}

/**
 * Warm up the application by visiting key pages
 */
async function warmupApplication() {
  console.log('🔥 Warming up application...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const pages = ['/', '/login', '/create-user', '/list'];
    
    for (const pagePath of pages) {
      await page.goto(`http://localhost:3000${pagePath}`);
      await page.waitForLoadState('networkidle');
    }
    
    console.log('✅ Application warmed up');
  } catch (error) {
    console.error('⚠️ Application warmup failed:', error);
    // Don't fail setup for warmup issues
  } finally {
    await browser.close();
  }
}

export default globalSetup;