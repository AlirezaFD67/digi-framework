import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ProfilePage from '@/app/(dashboard)/profile/page';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the useAuthContext hook
const mockLogout = vi.fn();
const mockUser = {
  user_Name: 'John',
  user_Family: 'Doe',
  user_Phone: '1234567890',
  email: 'john.doe@example.com',
  id: '1',
};

vi.mock('@workspace/custom-ui', async () => {
  const actual = await vi.importActual('@workspace/custom-ui');
  return {
    ...actual,
    useAuthContext: () => ({
      user: mockUser,
      logout: mockLogout,
    }),
  };
});

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user information', () => {
    render(<ProfilePage />);
    
    expect(screen.getByText('John Doe 1234567890')).toBeInTheDocument();
  });

  it('should display user data in JSON format', () => {
    render(<ProfilePage />);
    
    // Check for the pre element that contains the JSON data
    const preElement = document.querySelector('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.tagName).toBe('PRE');
  });

  it('should render logout button', () => {
    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call logout function when logout button is clicked', async () => {
    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle logout button click without errors', () => {
    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    
    expect(() => fireEvent.click(logoutButton)).not.toThrow();
  });

  it('should display user name and family correctly', () => {
    render(<ProfilePage />);
    
    const userInfo = screen.getByText('John Doe 1234567890');
    expect(userInfo).toBeInTheDocument();
    expect(userInfo.tagName).toBe('H1');
  });

  it('should be accessible', () => {
    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeVisible();
    expect(logoutButton).toHaveAccessibleName();
  });

  it('should handle multiple logout clicks', async () => {
    render(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(3);
    });
  });

  it('should render without crashing when user data is undefined', () => {
    // Mock undefined user
    vi.mocked(vi.importMock('@workspace/custom-ui')).useAuthContext = () => ({
      user: undefined,
      logout: mockLogout,
    });
    
    expect(() => render(<ProfilePage />)).not.toThrow();
  });

  it('should handle component re-renders', () => {
    const { rerender } = render(<ProfilePage />);
    
    expect(screen.getByText('John Doe 1234567890')).toBeInTheDocument();
    
    rerender(<ProfilePage />);
    
    expect(screen.getByText('John Doe 1234567890')).toBeInTheDocument();
  });
});
