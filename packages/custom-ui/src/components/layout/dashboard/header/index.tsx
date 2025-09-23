import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import { Breadcrumbs } from '@workspace/custom-ui/components/breadcrumbs';
import { ThemeToggle } from '@workspace/custom-ui/components/theme-toggle';
import { UserNav } from '@workspace/custom-ui/components/navigation/user-nav';

export default function DashboardHeader() {
  return (
    <header className='flex h-20 py-4 shrink-0 border-b border-border items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4 border-r border-border'>
        <ThemeToggle />
        <UserNav user={{
          fullName: 'John Doe',
          emailAddresses: [{ emailAddress: 'john.doe@example.com' }]
        }} />
      </div>
    </header>
  );
}
