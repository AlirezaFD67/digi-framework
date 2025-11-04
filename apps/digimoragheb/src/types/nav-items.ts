import Icons from '@workspace/custom-ui/components/icons';
export interface NavItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    shortcut?: [string, string];
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
    isActive?: boolean;
    items?: NavItem[];
}
export interface MainNavItem {
    title: string;
    url: string;
    key: string;
    showOnMobile: boolean;
    showOnDesktop: boolean;
}
export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[];
}

export type SidebarNavItem = NavItemWithChildren;

export interface FooterItem {
    title: string;
    items: {
        title: string;
        href: string;
        external?: boolean;
    }[];
}

