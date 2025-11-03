'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@workspace/ui/components/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from '../../../../../../../packages/custom-ui/src/types';
import { ThemeToggle } from '@workspace/custom-ui/components/theme-toggle';
import { UserAvatarProfile } from '@workspace/custom-ui/components/user-avatar-profile';
import Icons from '@workspace/custom-ui/components/icons';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import UIConfig from '@workspace/ui/lib/ui-config';

// ## --- Refactored Nav Item Component ---
// This new component handles the logic for rendering a single navigation item.
// It decides whether to render a simple link or a collapsible sub-menu.
// It also encapsulates all the active-state logic.

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
}

function SidebarNavItem({ item, pathname }: SidebarNavItemProps) {
  const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] : Icons.logo;

  // Check if item has sub-items
  const hasSubItems = item.items && item.items.length > 0;

  // Check if any child route is active
  const isChildActive =
    hasSubItems && item?.items?.some((subItem) => pathname === subItem.url);

  // Parent is active if its own URL matches or if a child is active
  const isParentActive = pathname === item.url || isChildActive;

  if (hasSubItems) {
    return (
      <Collapsible
        key={item.title}
        asChild
        defaultOpen={item.isActive || isChildActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={item.title}
              isActive={isParentActive}
              className={cn(
                'justify-start border-r-2 text bg-background items-center',
                isParentActive
                  ? 'border-secondary'
                  : 'border-transparent',
              )}
            >
              {item.icon && (
                <Icon className={cn(isParentActive && 'text-[var(--secondary)] ', "!size-6")} />
              )}
              <span className="ml-auto">{item.title}</span>
              <Icons.chevronRight
              
                className={cn(
                  'transition-transform duration-200 !size-5',
                  isParentActive && 'rotate-90',
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub  className='p-0'>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem className='mt-1' key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                    className="data-[active=true]:font-bold data-[active=true]:text-primary "
                  >
 
                    <Link href={subItem.url}>{subItem.title}</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // --- Render simple menu item (no sub-items) ---
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        size="lg"
        tooltip={item.title}
        isActive={pathname === item.url}
        className={cn(
          'border-r-2 bg-white',
          pathname === item.url ? 'border-secondary' : 'border-transparent',
        )}
      >
        <Link href={item.url}>
          {item.icon && (
            <Icon
              className={cn(
                '!size-6',
                pathname === item.url && 'text-[var(--secondary)]',
              )}
            />
          )}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ## --- Main AppSidebar Component ---
// Now much cleaner, simply maps over navItems and uses the SidebarNavItem component.

interface AppSidebarProps {
  navItems: NavItem[];
}

export default function AppSidebar({ navItems }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar side="right" variant="floating" collapsible="icon">
      <SidebarHeader>
        <ThemeToggle />
        <Image src={UIConfig.logo.secondary} alt="logo" width={100} height={100} />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Overview</SidebarGroupLabel> */}
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.title}
                item={item}
                pathname={pathname}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserAvatarProfile
                    className="h-8 w-8 rounded-lg"
                    showInfo
                    user={null} // TODO: Pass actual user data here
                  />
                  <Icons.chevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    <UserAvatarProfile
                      className="h-8 w-8 rounded-lg"
                      showInfo
                      user={null} // TODO: Pass actual user data here
                    />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  خروج {/* Consider using i18n for "Logout" */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}