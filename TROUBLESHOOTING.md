# Troubleshooting Guide

Common issues and their solutions when working with this Playwright project.

## Installation Issues

### Issue: npm install fails
**Error:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solution:**
1. Ensure Node.js is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`
4. Run `npm install` again

### Issue: Playwright browser installation fails
**Error:**
```
Error: Failed to download Chromium
```

**Solution:**
1. Check internet connection
2. Try manual installation:
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```
3. If behind proxy, configure proxy settings:
```bash
export HTTP_PROXY=http://proxy:port
export HTTPS_PROXY=http://proxy:port
npx playwright install
```

## Test Execution Issues

### Issue: Tests timeout
**Error:**
```
Test timeout of 30000ms exceeded
```

**Solution:**
1. Increase timeout in config:
```javascript
// playwright.config.js
timeout: 60 * 1000, // 60 seconds
```

2. Or in specific test:
```javascript
test('long running test', async ({ page }) => {
  test.setTimeout(60000);
  // test code
});
```

### Issue: Element not found
**Error:**
```
Error: Timeout waiting for selector
```

**Solution:**
1. Verify element exists in the HTML
2. Wait for page to load:
```javascript
await page.waitForLoadState('domcontentloaded');
```
3. Use more specific selector:
```javascript
await page.getByTestId('specific-element')
```
4. Add explicit wait:
```javascript
await page.waitForSelector('#element', { timeout: 5000 });
```

### Issue: Tests fail randomly (flaky tests)
**Solution:**
1. Add proper waits:
```javascript
await page.waitForURL('**/expected-page.html');
```

2. Use auto-waiting actions:
```javascript
await page.click('button'); // Auto-waits
```

3. Avoid arbitrary timeouts:
```javascript
// Bad
await page.waitForTimeout(1000);

// Good
await page.waitForSelector('#element');
```

4. Enable retries:
```javascript
// playwright.config.js
retries: 2,
```

## Browser Issues

### Issue: Browser doesn't open in headed mode
**Solution:**
```bash
# Try with specific browser
npx playwright test --project=chromium --headed

# Check if browser is installed
npx playwright install chromium
```

### Issue: Browser crashes
**Solution:**
1. Update Playwright:
```bash
npm install @playwright/test@latest
npx playwright install
```

2. Check system resources (memory, CPU)
3. Run fewer tests in parallel:
```javascript
// playwright.config.js
workers: 1,
```

## Web Application Issues

### Issue: Login page doesn't redirect
**Solution:**
1. Check credentials are correct:
   - Username: `admin`
   - Password: `admin123`
2. Clear browser storage:
```javascript
await page.evaluate(() => localStorage.clear());
```

### Issue: Users not persisting
**Solution:**
The application uses localStorage. Clear it between tests:
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('about:blank');
  await page.evaluate(() => localStorage.clear());
});
```

## Configuration Issues

### Issue: Base URL not working
**Solution:**
1. Verify `playwright.config.js`:
```javascript
use: {
  baseURL: 'file://' + process.cwd() + '/app/',
}
```

2. Use full path in tests:
```javascript
await page.goto('file://' + process.cwd() + '/app/login.html');
```

### Issue: Reports not generating
**Solution:**
1. Check reporter configuration:
```javascript
// playwright.config.js
reporter: [['html', { outputFolder: 'playwright-report' }]],
```

2. View report:
```bash
npx playwright show-report
```

## CI/CD Issues

### Issue: Jenkins pipeline fails
**Solution:**
1. Check Node.js is installed on Jenkins agent
2. Verify Playwright installation:
```groovy
sh 'npx playwright install --with-deps'
```

3. Check workspace permissions
4. Ensure browser dependencies are installed

### Issue: Tests pass locally but fail in CI
**Solution:**
1. Match CI environment to local:
```javascript
// playwright.config.js
workers: process.env.CI ? 1 : undefined,
```

2. Add more verbose logging:
```bash
DEBUG=pw:api npx playwright test
```

3. Enable video recording:
```javascript
video: 'on',
```

## Debugging Tips

### Enable Debug Mode
```bash
# Debug specific test
npx playwright test tests/login.spec.js --debug

# Debug with UI
npx playwright test --ui
```

### View Traces
```bash
# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Console Logging
```javascript
test('debug test', async ({ page }) => {
  page.on('console', msg => console.log('Browser log:', msg.text()));
  
  // Your test code
});
```

### Screenshots for Debugging
```javascript
await page.screenshot({ path: 'debug.png', fullPage: true });
```

### Slow Motion
```javascript
// playwright.config.js
use: {
  launchOptions: {
    slowMo: 1000, // Slow down by 1 second
  },
}
```

## Getting Help

If you're still experiencing issues:

1. **Check Documentation**
   - [Playwright Docs](https://playwright.dev)
   - Project README.md
   - Best Practices Guide

2. **Search Existing Issues**
   - GitHub Issues
   - Stack Overflow
   - Playwright Discord

3. **Create New Issue**
   - Provide error message
   - Include code snippet
   - Describe expected vs actual behavior
   - Include environment details:
     - OS version
     - Node.js version
     - Playwright version

## Useful Commands

```bash
# Check versions
node --version
npm --version
npx playwright --version

# Clear cache
npm cache clean --force
npx playwright install --force

# Verbose output
DEBUG=pw:api npx playwright test

# List installed browsers
npx playwright install --dry-run

# Run single test
npx playwright test tests/login.spec.js -g "should login"
```

## Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| ENOENT | File not found | Check file path |
| ECONNREFUSED | Connection refused | Check server is running |
| ETIMEDOUT | Request timeout | Increase timeout |
| EADDRINUSE | Port already in use | Change port or kill process |

Still need help? Open an issue with detailed information! 🆘
