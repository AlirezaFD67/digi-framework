import { render, screen } from '../utils/test-utils';
import DashboardPage from '@/app/(dashboard)/dashboard/page';
import { describe, it, expect } from 'vitest';

describe('DashboardPage', () => {
  it('should render welcome message', () => {
    render(<DashboardPage />);
    
    expect(screen.getByText('خوش آمدید به داشبورد')).toBeInTheDocument();
  });

  it('should render the main container div', () => {
    render(<DashboardPage />);
    
    const container = screen.getByText('خوش آمدید به داشبورد').parentElement;
    expect(container).toBeInTheDocument();
    expect(container?.tagName).toBe('DIV');
  });

  it('should have proper text content', () => {
    render(<DashboardPage />);
    
    const welcomeText = screen.getByText('خوش آمدید به داشبورد');
    expect(welcomeText).toHaveTextContent('خوش آمدید به داشبورد');
  });

  it('should render without crashing', () => {
    expect(() => render(<DashboardPage />)).not.toThrow();
  });

  it('should be accessible', () => {
    render(<DashboardPage />);
    
    // Check if the text is accessible
    const welcomeText = screen.getByText('خوش آمدید به داشبورد');
    expect(welcomeText).toBeVisible();
  });
});
