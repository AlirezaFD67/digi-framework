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

    // Helper function to find the root level from URL using navItems
    const getRootFromPath = (pathname: string, navItems: NavItem[]): BreadcrumbItem => {
      const segments = pathname.split('/').filter(Boolean);
      const rootSegment = segments[0] || 'home';
      
      // Try to find the root title from navItems
      const rootNavItem = navItems.find(item => {
        const itemSegments = item.url.split('/').filter(Boolean);
        return itemSegments[0] === rootSegment;
      });
      
      if (rootNavItem) {
        return { title: rootNavItem.title, link: rootNavItem.url };
      }
      
      // Fallback to default mapping if not found in navItems
      const defaultMappings: Record<string, string> = {
        'dashboard': 'داشبورد',
        'admin': 'مدیریت',
        'app': 'اپلیکیشن',
        'user': 'کاربر',
        'settings': 'تنظیمات',
        'home': 'خانه'
      };
      
      const rootTitle = defaultMappings[rootSegment] || rootSegment.charAt(0).toUpperCase() + rootSegment.slice(1);
      const rootLink = `/${rootSegment}`;
      
      return { title: rootTitle, link: rootLink };
    };

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

    // Get the root level automatically from the URL using navItems
    const rootItem = getRootFromPath(pathname, navItems);

    // Try to find the item and its complete path in navItems
    const foundPath = findItemWithPath(navItems, pathname);
    if (foundPath) {
      // Check if the found path already includes the root
      const hasRoot = foundPath.some(item => item.link === rootItem.link);
      
      if (hasRoot) {
        return foundPath;
      } else {
        // Prepend the root if not already included
        return [rootItem, ...foundPath];
      }
    }

    // If no match found in navItems, generate breadcrumbs from URL
    const segments = pathname.split('/').filter(Boolean);
    
    // Start with the detected root
    breadcrumbItems.push(rootItem);

    // Generate breadcrumbs for each segment (skip the first one as it's already added as root)
    segments.slice(1).forEach((segment: string, index: number) => {
      const path = `/${segments.slice(0, index + 2).join('/')}`;
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
