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
 * Navigation dropdown component specifically for doctors.
 * Displays doctor-specific menu items and profile information.
 */
export function DoctorNav() {
  const router = useRouter();
  const { doctor } = useAuthContext();

  if (!doctor) {
    return null;
  }

  const fullName = `${doctor.doc_Name} ${doctor.doc_Family}`;
  const imageUrl = ImageURL(doctor.doc_Img_Path || '', doctor.doc_Img || '');

  const avatarProps = {
    imageUrl,
    fullName: `دکتر ${fullName}`,
    emailAddresses: [{ emailAddress: doctor.doc_Tel || '' }]
  };

  const menuItems = [
    { label: 'پروفایل پزشکی', href: '/dashboard/profile' },
    { label: 'نوبت‌ها', href: '/dashboard/appointments' },
    { label: 'بیماران', href: '/dashboard/patients' },
    { label: 'تنظیمات' },
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
              دکتر {fullName}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {doctor.doc_Tel}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              کد نظام: {doctor.doc_Nezam}
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

