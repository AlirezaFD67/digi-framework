import { NavItem, MainNavItem } from '@/types/nav-items';
import { UserRole, type UserType } from '@workspace/framework';
import { routes } from './routes';

export const MainNavItems: MainNavItem[] = [
  {
    title: 'صفحه اصلی',
    url: routes.home,
    key: 'home',
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: 'نوبت‌دهی آنلاین',
    url: routes.booking.providers,
    key: 'providers',
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: 'داروخانه آنلاین',
    url: routes.pharmacy.root,
    key: 'pharmacy',
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: 'بسته‌ها',
    url: routes.packages,
    key: 'packages',
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: 'خیریه',
    url: routes.charity,
    key: 'charity',
    showOnMobile: true,
    showOnDesktop: false,
  },
  {
    title: 'همیار بیمار',
    url: routes.services.patientCompanion,
    key: 'patient-companion',
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    title: 'غربالگری',
    url: routes.screeningList.root,
    key: 'screening-list',
    showOnMobile: true,
    showOnDesktop: false,
  },
  {
    title: 'مجله سلامت',
    url: routes.articles.root,
    key: 'articles',
    showOnMobile: true,
    showOnDesktop: true,
  },
]
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