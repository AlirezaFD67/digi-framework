# Testing Setup for Digimoragheb

This document describes the complete testing setup for the Digimoragheb app, following the monorepo testing guidelines.

## 📁 File Structure

```
apps/digimoragheb/
├── vitest.config.ts                    # Vitest configuration
├── src/
│   └── __tests__/
│       ├── setup.ts                    # Test setup and cleanup
│       ├── utils/
│       │   └── test-utils.tsx          # Test utilities and providers
│       ├── mocks/
│       │   ├── handlers.ts             # MSW API handlers
│       │   └── server.ts              # MSW server setup
│       ├── config/
│       │   └── test-config.ts          # Test configuration constants
│       ├── pages/
│       │   ├── DashboardPage.test.tsx           # Dashboard page tests
│       │   ├── DashboardPage.integration.test.tsx  # Integration tests
│       │   ├── AuthPage.test.tsx                # Auth page tests
│       │   └── ProfilePage.test.tsx              # Profile page tests
│       └── README.md                   # Testing documentation
└── package.json                        # Updated with test scripts
```

## 🚀 Quick Start

### Install Dependencies
```bash
cd apps/digimoragheb
pnpm install
```

### Run Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run
```

## 🧪 Test Coverage

### Current Test Files

1. **DashboardPage.test.tsx** - Basic component tests
2. **DashboardPage.integration.test.tsx** - Integration and advanced tests
3. **AuthPage.test.tsx** - Authentication page tests
4. **ProfilePage.test.tsx** - User profile page tests

### Test Types Covered

- ✅ **Component Rendering** - Basic component rendering tests
- ✅ **User Interactions** - Button clicks, form submissions
- ✅ **Accessibility** - Screen reader compatibility
- ✅ **Integration** - Component integration with providers
- ✅ **Error Handling** - Error scenarios and edge cases
- ✅ **API Mocking** - MSW for API call mocking
- ✅ **Router Mocking** - Next.js router mocking
- ✅ **Context Mocking** - Custom UI context mocking

## 🔧 Configuration Details

### Vitest Configuration
- **Environment**: jsdom for DOM testing
- **Setup**: Automatic cleanup and MSW server
- **Aliases**: Workspace package aliases configured
- **Coverage**: V8 coverage provider

### Test Utilities
- **renderWithProviders**: Includes all necessary providers
- **MSW Integration**: API mocking with Mock Service Worker
- **Mock Data**: Predefined test data and configurations

### Provider Setup
Tests include the following providers:
- `QueryClientProvider` - React Query for data fetching
- `CustomUIProvider` - Custom UI components context
- `FrameworkProvider` - Framework functionality

## 📊 Coverage Goals

- **Minimum 70%** for application components
- **100%** for utility functions
- **80%** for complex business logic

## 🎯 Best Practices Implemented

1. **Semantic Queries** - Using `getByRole`, `getByText` instead of test IDs
2. **User-Centric Testing** - Testing user interactions, not implementation
3. **Proper Mocking** - Mocking external dependencies appropriately
4. **Cleanup** - Automatic cleanup after each test
5. **Isolation** - Tests are independent and can run in any order
6. **Descriptive Names** - Clear test descriptions explaining behavior

## 🔍 Example Test Structure

```typescript
import { render, screen, fireEvent } from '../utils/test-utils';
import MyComponent from '@/components/MyComponent';
import { describe, it, expect, vi } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const mockHandler = vi.fn();
    render(<MyComponent onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all workspace packages are properly aliased
2. **Provider Errors**: Ensure all necessary providers are included in test utils
3. **Mock Issues**: Check that mocks are properly configured and cleared
4. **Timeout Issues**: Increase timeout values for slow operations

### Debug Commands

```bash
# Run specific test file
pnpm test DashboardPage.test.tsx

# Run tests with verbose output
pnpm test --reporter=verbose

# Run tests with coverage and HTML report
pnpm test:coverage --reporter=html
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Guidelines](../prompts/task/TESTING_GUIDELINES.markdown)
