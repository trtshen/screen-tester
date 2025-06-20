# screen-tester

[![Test Coverage](https://github.com/trtshen/screen-tester/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/trtshen/screen-tester/actions/workflows/test-coverage.yml)
[![Deploy to GitHub Pages](https://github.com/trtshen/screen-tester/actions/workflows/deploy-page.yml/badge.svg)](https://github.com/trtshen/screen-tester/actions/workflows/deploy-page.yml)
[![codecov](https://codecov.io/gh/trtshen/screen-tester/branch/master/graph/badge.svg)](https://codecov.io/gh/trtshen/screen-tester)

Test and find out problems of your screen/monitor before it's too late (don't bring a faulty new gadget home)!

Demo: https://trtshen.github.io/screen-tester/

## Features

- **Solid Color Tests**: Test for dead pixels, color accuracy, and uniformity
- **Pattern Tests**: Detect display issues with gradients, lines, and geometric patterns  
- **Motion Tests**: Check for ghosting, tearing, and refresh rate problems
- **Flicker Tests**: Evaluate screen comfort and flicker sensitivity
- **Interactive Controls**: Keyboard shortcuts for easy navigation

## Usage

- **Click** or **Arrow Keys**: Navigate between test patterns
- **F**: Toggle fullscreen mode
- **G**: Toggle grid overlay
- **C**: Toggle crosshair overlay
- **Escape**: Exit fullscreen

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Test Coverage

This project maintains high test coverage for core functionality:
- **100%** line coverage
- **100%** function coverage  
- **100%** branch coverage

Tests cover:
- Component rendering and interaction
- Keyboard navigation
- Fullscreen functionality
- Pattern cycling logic
