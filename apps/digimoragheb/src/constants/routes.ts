export const routes = {
  home: "/",
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