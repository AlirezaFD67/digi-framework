export const routes = {
  home: "/",
  booking: {
    root: "/booking/",
    providers: "/providers/",
  },
  articles: {
    root: "/articles/",
  },
  charity: "/charity/",
  contactUs: "/contact-us/",
  faqs: "/faqs/",
  packages: "/packages/",
  pharmacy: {
    root: "/pharmacy/",
  },
  rules: "/rules/",
  screeningList: {
    root: "/screening-list/",
  },
  services: {
    root: "/services/",
    patientCompanion: "/services/patient-companion/",
  },







  
  dashboard: {
   root: "/dashboard",
   single: (id: string) => `/dashboard/${id}`,
   articles: {
    root: "/dashboard/articles",
    single: (id: string) => `/dashboard/articles/${id}`,
   },
  },
  profile: "/dashboard/profile",
  auth: {
    login: "/auth",
  },

  





}



const dashboardDoctorRoutes = {
  root: "/dashboard",
  single: (id: string) => `/dashboard/${id}`,
  articles: {
    root: "/dashboard/articles",
    single: (id: string) => `/dashboard/articles/${id}`,
  },
}

const dashboardUserRoute = {
  root: "/dashboard",
  single: (id: string) => `/dashboard/${id}`,
  articles: {
    root: "/dashboard/articles",
    single: (id: string) => `/dashboard/articles/${id}`,
  },
}