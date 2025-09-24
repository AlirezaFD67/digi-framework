'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { NavItem } from '../types';
import { useBreadcrumbs } from '../hooks/use-breadcrumbs';
import { IconSlash } from '@tabler/icons-react';
import { Fragment } from 'react';

interface BreadcrumbsProps {
  navItems: NavItem[];
}

export function Breadcrumbs({ navItems }: BreadcrumbsProps) {
  const items = useBreadcrumbs(navItems);
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item: any, index: number) => (
          <Fragment key={item.title || index}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <IconSlash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
