import { QueryClient } from '@tanstack/react-query';
import { vi } from 'vitest';

// Test configuration constants
export const TEST_CONFIG = {
  // Query client configuration for tests
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  }),

  // Mock data
  mockUser: {
    id: '1',
    user_Name: 'Test',
    user_Family: 'User',
    user_Phone: '1234567890',
    email: 'test@example.com',
  },

  mockAuthResponse: {
    token: 'fake-jwt-token',
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    },
  },

  // Test timeouts
  timeouts: {
    default: 5000,
    long: 10000,
    short: 1000,
  },
};

// Helper functions for tests
export const testHelpers = {
  // Wait for element to appear
  waitForElement: async (selector: string, timeout = TEST_CONFIG.timeouts.default) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(checkElement, 100);
        }
      };
      checkElement();
    });
  },

  // Mock console methods
  mockConsole: () => {
    const originalConsole = { ...console };
    const mockConsole = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
    };
    
    Object.assign(console, mockConsole);
    
    return {
      mockConsole,
      restore: () => Object.assign(console, originalConsole),
    };
  },
};

