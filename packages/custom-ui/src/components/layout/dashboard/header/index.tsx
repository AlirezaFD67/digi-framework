import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import { Breadcrumbs } from '../../../breadcrumbs';
import { ThemeToggle } from '../../../theme-toggle';
import { UserNav } from '../../../navigation/user-nav';
import { NavItem } from '../../../../types';


interface DashboardHeaderProps {
  navItems: NavItem[];
}

export default function DashboardHeader({ navItems }: DashboardHeaderProps) {
  return (
    <header className='flex  h-20 py-4 shrink-0 border-b border-border items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
      </div>
        <Breadcrumbs navItems={navItems} />

      <div className='flex items-center gap-2 px-4 border-r border-border'>
        <UserNav user={{
          fullName: 'John Doe',
          emailAddresses: [{ emailAddress: 'john.doe@example.com' }]
        }} />
      </div>
    </header>
  );
}
