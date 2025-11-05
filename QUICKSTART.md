# Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install Browsers
```bash
npx playwright install
```

### Step 3: Run Tests
```bash
npm test
```

That's it! Your tests are now running.

## Viewing the Web Application

### Option 1: Direct Browser Access
Simply open any of the HTML files in your browser:
- `app/login.html` - Login page
- `app/list.html` - User list page
- `app/create-user.html` - Create user page

### Option 2: Using a Local Server
```bash
npx serve app
```
Then open http://localhost:3000

## Test Credentials

**Username:** admin  
**Password:** admin123

## Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:debug` | Debug tests |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:report` | View test report |

## Project Structure Overview

```
├── app/              # Web application
├── tests/            # Test files
├── pages/            # Page objects
├── utils/            # Utilities
└── data/             # Test data
```

## Next Steps

1. Explore the test files in the `tests/` directory
2. Review the Page Object Model in `pages/` directory
3. Customize the web application in `app/` directory
4. Set up Jenkins pipeline using the `Jenkinsfile`

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review Playwright documentation: https://playwright.dev
- Open an issue if you encounter problems

Happy testing! 🎭
