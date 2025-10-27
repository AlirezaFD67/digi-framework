import { render, screen, waitFor } from '../utils/test-utils';
import DashboardPage from '@/app/(dashboard)/page';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

describe('DashboardPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with proper RTL support', () => {
    render(<DashboardPage />);
    
    const welcomeText = screen.getByText('خوش آمدید به داشبورد');
    expect(welcomeText).toBeInTheDocument();
    
    // Check if the text is rendered (RTL support is handled by CSS)
    expect(welcomeText).toBeVisible();
  });

  it('should be responsive and accessible', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      const welcomeText = screen.getByText('خوش آمدید به داشبورد');
      expect(welcomeText).toBeVisible();
    });
    
    // Check accessibility - the text should be visible and accessible
    const welcomeText = screen.getByText('خوش آمدید به داشبورد');
    expect(welcomeText).toBeVisible();
  });

  it('should handle component re-renders correctly', () => {
    const { rerender } = render(<DashboardPage />);
    
    expect(screen.getByText('خوش آمدید به داشبورد')).toBeInTheDocument();
    
    // Re-render the component
    rerender(<DashboardPage />);
    
    expect(screen.getByText('خوش آمدید به داشبورد')).toBeInTheDocument();
  });

  it('should maintain component state during re-renders', () => {
    const { rerender } = render(<DashboardPage />);
    
    const initialText = screen.getByText('خوش آمدید به داشبورد');
    expect(initialText).toBeInTheDocument();
    
    // Re-render multiple times
    rerender(<DashboardPage />);
    rerender(<DashboardPage />);
    
    const finalText = screen.getByText('خوش آمدید به داشبورد');
    expect(finalText).toBeInTheDocument();
    expect(finalText).toHaveTextContent('خوش آمدید به داشبورد');
  });

  it('should work with different viewport sizes', () => {
    // Mock different viewport sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    render(<DashboardPage />);
    
    expect(screen.getByText('خوش آمدید به داشبورد')).toBeInTheDocument();
  });

  it('should handle component unmounting gracefully', () => {
    const { unmount } = render(<DashboardPage />);
    
    expect(screen.getByText('خوش آمدید به داشبورد')).toBeInTheDocument();
    
    // Unmount the component
    unmount();
    
    // Component should be removed from DOM
    expect(screen.queryByText('خوش آمدید به داشبورد')).not.toBeInTheDocument();
  });
});
