'use client';

import { Button } from '@workspace/ui/components/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
  redirectUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ 
  redirectUrl = '/auth/sign-in', 
  className,
  children 
}: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Here you would typically call your sign-out API
      // For now, we'll just redirect to the sign-in page
      // You can replace this with actual sign-out logic
      console.log('Signing out...');
      
      // Clear any stored authentication data
      localStorage.removeItem('auth-token');
      sessionStorage.clear();
      
      // Redirect to sign-in page
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className={`w-full justify-start ${className || ''}`}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {children || 'خروج از حساب'}
    </Button>
  );
}

