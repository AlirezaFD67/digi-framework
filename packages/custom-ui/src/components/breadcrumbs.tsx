'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb';
import { NavItem } from '../types';
import { useBreadcrumbs } from '../hooks/use-breadcrumbs';
import { IconSlash } from '@tabler/icons-react';
import { Fragment } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

interface BreadcrumbsProps {
  navItems: NavItem[];
}

export function Breadcrumbs({ navItems }: BreadcrumbsProps) {
  const items = useBreadcrumbs(navItems);
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={cn('mx-auto md:!mr-0 md:!ml-auto')} >
      <BreadcrumbList >
        {items.map((item: any, index: number) => (
          <Fragment key={item.title || index}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink asChild><Link href={item.link}>{item.title}</Link></BreadcrumbLink>
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
