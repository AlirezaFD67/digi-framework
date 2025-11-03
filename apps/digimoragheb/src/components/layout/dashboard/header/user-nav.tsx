'use client';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { UserAvatarProfile } from '@workspace/custom-ui/components/user-avatar-profile';
import { SignOutButton } from '@workspace/custom-ui/components/auth/sign-out-button';
import { useRouter } from 'next/navigation';
import { ImageURL } from '@workspace/utils';
import { routes } from '@/constants/routes';
import { useAuthContext } from '@workspace/custom-ui';

/**
 * Navigation dropdown component specifically for regular users.
 * Displays user-specific menu items and profile information.
 */
export function UserNav() {
  const router = useRouter();
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  const imageUrl = ImageURL(user.img_Path || '', user.user_Img || '');

  const avatarProps = {
    imageUrl,
    fullName: user.user_Name || '',
    emailAddresses: [{ emailAddress: user.user_Phone || '' }]
  };

  const menuItems = [
    { label: 'پروفایل', href: '/dashboard/profile' },
    { label: 'صورت حساب' },
    { label: 'تنظیمات' },
    { label: 'تیم جدید' },
  ];

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <UserAvatarProfile user={avatarProps} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {user.user_Name}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.user_Phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => item.href && router.push(item.href)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton redirectUrl={routes.auth.login} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}