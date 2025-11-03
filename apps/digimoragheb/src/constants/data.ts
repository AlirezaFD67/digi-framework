
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};


export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'علی احمدی',
    email: 'ali.ahmadi@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'عا'
  },
  {
    id: 2,
    name: 'فاطمه رضایی',
    email: 'fateme.razai@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'فر'
  },
  {
    id: 3,
    name: 'محمد حسینی',
    email: 'mohammad.hosseini@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'مح'
  },
  {
    id: 4,
    name: 'زهرا کریمی',
    email: 'zahra.karimi@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'زک'
  },
  {
    id: 5,
    name: 'حسن مرادی',
    email: 'hasan.moradi@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'حم'
  }
];
