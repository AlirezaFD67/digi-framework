# Testing Setup for Application Expert

This directory contains all test files for the Application Expert app, following the monorepo testing guidelines.

## Structure

```
src/__tests__/
├── setup.ts                    # Test setup and cleanup
├── utils/
│   └── test-utils.tsx         # Test utilities and providers
├── pages/
│   └── DashboardPage.test.tsx # Page component tests
└── README.md                  # This file
```

## Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### Coverage Report
```bash
pnpm test:coverage
```

### UI Mode
```bash
pnpm test:ui
```

### Run Once
```bash
pnpm test:run
```

## Test Configuration

- **Framework**: Vitest with React Testing Library
- **Environment**: jsdom
- **Coverage**: V8 coverage provider
- **Setup**: Automatic cleanup after each test

## Writing Tests

### Basic Component Test
```typescript
import { render, screen } from '../utils/test-utils';
import MyComponent from '@/components/MyComponent';
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Test with Providers
The `test-utils.tsx` file provides a `renderWithProviders` function that includes:
- QueryClient for React Query
- CustomUIProvider for custom UI components
- FrameworkProvider for framework functionality

## Coverage Goals

- **Minimum 70%** for application components
- **100%** for utility functions
- **80%** for complex business logic

## Best Practices

1. **Test user interactions**, not implementation details
2. **Use semantic queries** (getByRole, getByLabelText, etc.)
3. **Mock external dependencies** appropriately
4. **Keep tests independent** and isolated
5. **Use descriptive test names** that explain the behavior
