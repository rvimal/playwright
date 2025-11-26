/**
 * Test Data Manager
 * 
 * Manages test data creation, retrieval, and cleanup for tests.
 * Supports environment-specific data and dynamic data generation.
 */

export class TestDataManager {
  constructor() {
    this.createdData = new Set();
    this.environment = process.env.NODE_ENV || 'test';
  }

  async initialize() {
    // Initialize any required test data
    console.log(`Initializing test data for environment: ${this.environment}`);
  }

  /**
   * Get credentials for different user types
   */
  async getCredentials(userType = 'default') {
    const credentials = {
      default: {
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      },
      admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        email: 'admin@example.com'
      },
      api: {
        token: process.env.API_TOKEN || 'test-api-token',
        apiKey: process.env.API_KEY || 'test-api-key'
      },
      guest: {
        username: 'guest',
        password: 'guest123',
        email: 'guest@example.com'
      }
    };

    return credentials[userType] || credentials.default;
  }

  /**
   * Generate unique test user data
   */
  async generateUser(overrides = {}) {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    
    const userData = {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}${randomId}@example.com`,
      phone: `555-${String(timestamp).slice(-4)}-${String(randomId).padStart(4, '0')}`,
      department: 'IT',
      role: 'Developer',
      ...overrides
    };

    // Track created data for cleanup
    this.createdData.add({
      type: 'user',
      data: userData,
      timestamp: new Date()
    });

    return userData;
  }

  /**
   * Generate test data for different scenarios
   */
  async getTestData(scenario) {
    const testData = {
      validUser: await this.generateUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-1234-5678'
      }),

      invalidUser: {
        name: '',
        email: 'invalid-email',
        phone: 'abc123'
      },

      userWithSpecialChars: await this.generateUser({
        name: 'José María O\'Connor',
        email: 'jose.maria@example.com'
      }),

      bulkUsers: await Promise.all(
        Array.from({ length: 5 }, (_, i) => 
          this.generateUser({ name: `Bulk User ${i + 1}` })
        )
      ),

      formData: {
        search: {
          valid: 'John',
          empty: '',
          special: '@#$%',
          long: 'A'.repeat(100)
        },
        pagination: {
          page: 1,
          limit: 10,
          maxLimit: 100
        }
      }
    };

    return testData[scenario] || testData;
  }

  /**
   * Create test data in the application (via API or UI)
   */
  async createTestUser(userData, method = 'api') {
    if (method === 'api') {
      // Implementation would create user via API
      console.log('Creating user via API:', userData.email);
    } else {
      // Implementation would create user via UI
      console.log('Creating user via UI:', userData.email);
    }

    this.createdData.add({
      type: 'user',
      data: userData,
      method,
      timestamp: new Date()
    });

    return userData;
  }

  /**
   * Get file paths for test assets
   */
  getTestFiles() {
    return {
      validImage: 'data/assets/test-image.jpg',
      invalidFile: 'data/assets/invalid-file.txt',
      largeFile: 'data/assets/large-file.pdf',
      csvData: 'data/assets/test-data.csv'
    };
  }

  /**
   * Cleanup created test data
   */
  async cleanup() {
    console.log(`Cleaning up ${this.createdData.size} test data entries`);
    
    for (const dataEntry of this.createdData) {
      try {
        if (dataEntry.type === 'user') {
          // Implementation would delete user data
          console.log(`Cleaning up user: ${dataEntry.data.email}`);
        }
      } catch (error) {
        console.warn(`Failed to cleanup data: ${error.message}`);
      }
    }

    this.createdData.clear();
  }

  /**
   * Generate random data for stress testing
   */
  generateRandomData(type, count = 1) {
    const generators = {
      email: () => `test${Date.now()}${Math.random().toString(36).substr(2, 9)}@example.com`,
      name: () => `Test User ${Math.random().toString(36).substr(2, 9)}`,
      phone: () => `555-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      text: (length = 10) => Math.random().toString(36).substr(2, length)
    };

    const generator = generators[type];
    if (!generator) {
      throw new Error(`Unknown data type: ${type}`);
    }

    return Array.from({ length: count }, generator);
  }
}