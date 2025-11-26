/**
 * Configuration Manager
 * 
 * Manages environment-specific configuration and settings for tests.
 */

export class ConfigManager {
  constructor() {
    this.environment = process.env.NODE_ENV || 'test';
    this.config = this.loadConfiguration();
  }

  loadConfiguration() {
    const baseConfig = {
      timeouts: {
        default: 30000,
        navigation: 60000,
        api: 10000
      },
      urls: {
        base: 'http://localhost:3000',
        api: 'http://localhost:3000/api',
        login: '/login',
        dashboard: '/dashboard'
      },
      browser: {
        headless: process.env.CI === 'true',
        slowMo: process.env.SLOW_MO || 0,
        video: process.env.VIDEO === 'true'
      }
    };

    const environmentConfigs = {
      development: {
        ...baseConfig,
        urls: {
          ...baseConfig.urls,
          base: 'http://localhost:3000'
        },
        browser: {
          ...baseConfig.browser,
          headless: false
        }
      },
      staging: {
        ...baseConfig,
        urls: {
          ...baseConfig.urls,
          base: 'https://staging.example.com',
          api: 'https://staging.example.com/api'
        }
      },
      production: {
        ...baseConfig,
        urls: {
          ...baseConfig.urls,
          base: 'https://example.com',
          api: 'https://api.example.com'
        },
        timeouts: {
          ...baseConfig.timeouts,
          default: 60000,
          navigation: 120000
        }
      }
    };

    return environmentConfigs[this.environment] || baseConfig;
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  getUrl(key) {
    return this.get(`urls.${key}`);
  }

  getTimeout(key) {
    return this.get(`timeouts.${key}`);
  }

  getBrowserConfig() {
    return this.get('browser');
  }

  getEnvironment() {
    return this.environment;
  }

  isCI() {
    return process.env.CI === 'true';
  }

  shouldTakeVideo() {
    return this.get('browser.video') || this.isCI();
  }
}