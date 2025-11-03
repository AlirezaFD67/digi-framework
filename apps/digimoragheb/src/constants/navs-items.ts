import { NavItem } from '@workspace/custom-ui/types';
import { UserRole, type UserType } from '@workspace/framework';
import { routes } from './routes';

//اطلاعات: داده‌های زیر برای ناوبری کناری و نوار Cmd K استفاده می‌شود.
export const UserNavItems: NavItem[] = [
    {
      title: 'حساب کاربری',
      url: '#', // نگهدارنده چون هیچ لینک مستقیمی برای والد وجود ندارد
      icon: 'billing',
      isActive: true,
  
      items: [
         {
          title: 'پروفایل',
          url: routes.profile,
          icon: 'userPen',
          shortcut: ['m', 'm']
        }
      ]
    },
  ];
  

  //اطلاعات: داده‌های زیر برای ناوبری کناری و نوار Cmd K استفاده می‌شود.
export const DoctorNavItems: NavItem[] = [

    {
      title: 'داشبورد',
      url: routes.dashboard.root,
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [] // آرایه خالی چون هیچ آیتم فرزندی برای داشبورد وجود ندارد
    },
  ];
  


export const getNavItems = (userType: UserType): NavItem[] => {
    if (userType === UserRole.User) {
        return UserNavItems;
    } else if (userType === UserRole.Doctor) {
        return DoctorNavItems;
    } else {
        return [];
    }
};