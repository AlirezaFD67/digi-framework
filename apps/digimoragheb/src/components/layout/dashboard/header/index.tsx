'use client';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import { Breadcrumbs } from '@workspace/custom-ui/components/breadcrumbs';
import { UserNav } from '@/components/layout/dashboard/header/user-nav';
import { DoctorNav } from '@/components/layout/dashboard/header/doctor-nav';
import { NavItem } from '../../../../../../../packages/custom-ui/src/types';
import { useAuthContext } from '@workspace/custom-ui';

interface DashboardHeaderProps {
  navItems: NavItem[];
}

export default function DashboardHeader({ navItems }: DashboardHeaderProps) {
  const { userType } = useAuthContext();

  return (
    <header className='flex  h-20 py-4 shrink-0 border-b border-border items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
      </div>
        <Breadcrumbs navItems={navItems} />

      <div className='flex items-center gap-2 px-4 border-r border-border'>
        {userType === 'doctor' ? <DoctorNav /> : <UserNav />}
      </div>
    </header>
  );
}
