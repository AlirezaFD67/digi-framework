'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { NavItem } from '../types';

type BreadcrumbItem = {
  title: string;
  link: string;
};

export function useBreadcrumbs(navItems: NavItem[] = []) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const breadcrumbItems: BreadcrumbItem[] = [];

    // Helper function to find item and its parent path
    const findItemWithPath = (items: NavItem[], targetUrl: string, parentPath: BreadcrumbItem[] = []): BreadcrumbItem[] | null => {
      for (const item of items) {
        const currentPath = [...parentPath, { title: item.title, link: item.url }];
        
        if (item.url === targetUrl) {
          return currentPath;
        }
        
        if (item.items && item.items.length > 0) {
          const found = findItemWithPath(item.items, targetUrl, currentPath);
          if (found) return found;
        }
      }
      return null;
    };

    // Try to find the item and its complete path in navItems
    const foundPath = findItemWithPath(navItems, pathname);
    if (foundPath) {
      return foundPath;
    }

    // If no match found in navItems, generate breadcrumbs from URL
    const segments = pathname.split('/').filter(Boolean);
    
    // Always start with Dashboard
    breadcrumbItems.push({
      title: 'داشبورد',
      link: '/dashboard'
    });

    // Generate breadcrumbs for each segment
    segments.forEach((segment: string, index: number) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbItems.push({
        title,
        link: path
      });
    });

    return breadcrumbItems;
  }, [pathname, navItems]);

  return breadcrumbs;
}
