'use client';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail } from "@workspace/ui/components/sidebar"
// import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"
import Icons from "../../../icons"
import { UserAvatarProfile } from '../../../user-avatar-profile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@workspace/ui/components/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from "../../../../types";
import { ThemeToggle } from "../../../theme-toggle";



interface AppSidebarProps {
  navItems: NavItem[];
}



export default function AppSidebar({ navItems }: AppSidebarProps) {
  const pathname = usePathname();
  // const { isOpen } = useMediaQuery();
  const router = useRouter();



  // React.useEffect(() => {
  //   // Side effects based on sidebar state changes
  // }, [isOpen]);

  return (
    <Sidebar side="right" collapsible='icon'>
      <SidebarHeader>
        <ThemeToggle />
      </SidebarHeader>

      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] : Icons.logo;
              // Check if any child route is active
              const isChildActive = item?.items?.some((subItem: any) => pathname === subItem.url);
              const isParentActive = pathname === item.url || isChildActive;

              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive || isChildActive}
                  className='group/collapsible'

                >
                  <SidebarMenuItem  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        tooltip={item.title}
                        isActive={isParentActive}
                        style={{ borderWidth: "0 2px 0 0" }}
                        className={`${isParentActive ? ' data-[active=true]:border-secondary' : ' border-transparent'} justify-start`}
                      >
                        {item.icon && <Icon className={`${isParentActive ? 'text-[var(--secondary)]' : ''}`} />}
                        <span className='ml-auto' >{item.title}</span>
                        <Icons.chevronRight className={`${isParentActive ? 'rotate-90' : ''} self-end transition-transform duration-200`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent >
                      <SidebarMenuSub >
                        {item.items?.map((subItem: any) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className="data-[active=true]:text-primary data-[active=true]:font-bold"
                            >
                              <Link href={subItem.url}>
                                <span className={pathname === subItem.url ? 'font-bold text-primary' : ''}>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem
                  key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    style={{ borderWidth: "0 2px 0 0" }}

                    className=" border-transparent data-[active=true]:border-secondary border-r"
                  >
                    <Link href={item.url}>
                      {item.icon && <Icon className={`${pathname === item.url ? 'text-[var(--secondary)]' : ''}`} />}

                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {/* {user && ( */}
                  <UserAvatarProfile
                    className='h-8 w-8 rounded-lg'
                    showInfo
                    user={null}
                  />
                  {/* )} */}
                  <Icons.chevronDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    {/* {user && ( */}
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={null}
                    />
                    {/* )} */}
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
                  خروج
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
