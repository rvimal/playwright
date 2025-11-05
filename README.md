# Playwright Automation Testing Project

A simple Playwright project with best practices for automation testing. This project includes a sample web application with login, user list, and user creation pages, along with comprehensive test coverage using the Page Object Model (POM) pattern.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Web Application](#web-application)
- [Best Practices Implemented](#best-practices-implemented)
- [Jenkins Pipeline](#jenkins-pipeline)
- [Contributing](#contributing)

## ✨ Features

- **Simple Web Application**: Login, User List, and Create User pages
- **Page Object Model (POM)**: Organized and maintainable test structure
- **Comprehensive Test Coverage**: Tests for all major user flows
- **Cross-browser Testing**: Support for Chromium, Firefox, and WebKit
- **CI/CD Ready**: Jenkins pipeline configuration included
- **Best Practices**: Industry-standard patterns and configurations
- **Detailed Reporting**: HTML, JSON, and JUnit reports

## 📁 Project Structure

```
playwright/
├── app/                        # Web application files
│   ├── login.html             # Login page
│   ├── list.html              # User list page
│   └── create-user.html       # Create user page
├── tests/                      # Test files
│   ├── login.spec.js          # Login page tests
│   ├── userList.spec.js       # User list tests
│   └── createUser.spec.js     # Create user tests
├── pages/                      # Page Object Model files
│   ├── BasePage.js            # Base page object
│   ├── LoginPage.js           # Login page object
│   ├── UserListPage.js        # User list page object
│   └── CreateUserPage.js      # Create user page object
├── utils/                      # Utility files
│   └── helpers.js             # Helper functions
├── data/                       # Test data
│   └── testData.js            # Test data constants
├── playwright.config.js        # Playwright configuration
├── Jenkinsfile                # Jenkins pipeline configuration
└── package.json               # NPM dependencies
```

## 🔧 Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/rvimal/playwright.git
cd playwright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in specific browser
```bash
npm run test:chrome    # Run in Chromium
npm run test:firefox   # Run in Firefox
npm run test:webkit    # Run in WebKit
```

### View test report
```bash
npm run test:report
```

## 🌐 Web Application

The project includes a simple web application with three pages:

### 1. Login Page (`app/login.html`)
- **URL**: Open `app/login.html` in your browser
- **Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **Features**: Form validation, error messages, success messages

### 2. User List Page (`app/list.html`)
- **URL**: Open `app/list.html` in your browser (after login)
- **Features**: 
  - View all users
  - Create new user
  - Delete user
  - Responsive table

### 3. Create User Page (`app/create-user.html`)
- **URL**: Open `app/create-user.html` in your browser
- **Features**: 
  - Form to create new user
  - Field validation
  - Role selection
  - Cancel/Submit actions

### Opening the Web Application

You can open the web application in two ways:

1. **Directly in browser**: Navigate to the `app` folder and open any HTML file
2. **Using a local server**: 
```bash
npx serve app
```

## ✅ Best Practices Implemented

### 1. Page Object Model (POM)
- Separation of test logic and page interactions
- Reusable page objects
- Maintainable code structure

### 2. Test Organization
- Descriptive test names
- Proper test grouping with `describe` blocks
- Before/after hooks for setup and cleanup

### 3. Configuration
- Centralized Playwright configuration
- Multiple browser support
- Parallel test execution
- Retry mechanism for flaky tests

### 4. Reporting
- HTML reports for visual analysis
- JUnit XML for CI/CD integration
- JSON reports for programmatic analysis

### 5. Data Management
- Centralized test data
- Helper utilities for common operations
- Random data generation

### 6. Locator Strategy
- Using `data-testid` attributes for reliable selectors
- Avoiding brittle CSS selectors
- Playwright's recommended locators

### 7. Wait Strategies
- Automatic waiting with Playwright
- Explicit waits when needed
- Proper timeout configuration

### 8. Error Handling
- Screenshot on failure
- Video recording on failure
- Trace collection for debugging

## 🔄 Jenkins Pipeline

The project includes a `Jenkinsfile` for CI/CD integration with Jenkins.

### Pipeline Features

- **Automated Test Execution**: Runs tests on every commit
- **Browser Selection**: Parameter to choose browser
- **Headed Mode Option**: Run tests in headed mode
- **Report Generation**: Automatic HTML report generation
- **Artifact Archiving**: Screenshots, videos, and reports
- **JUnit Integration**: Test results integration

### Setup Jenkins Pipeline

1. Create a new Pipeline job in Jenkins
2. Configure the repository URL
3. Set the script path to `Jenkinsfile`
4. Save and run the pipeline

### Pipeline Parameters

- **BROWSER**: Select browser (chromium, firefox, webkit, all)
- **HEADED_MODE**: Run tests in headed mode (true/false)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Happy Testing! 🎭**