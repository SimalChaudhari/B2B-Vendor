
const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://www.alovate.io/',
  changelog: 'https://www.alovate.io/',
  zoneStore: 'https://www.alovate.io/',
  minimalStore: 'https://www.alovate.io/',
  freeUI: 'https://www.alovate.io/',
  figma: 'https://www.alovate.io/',
  users: {
    root: `/users`,
    list: `/users/list`,
    details: (id) => `/users/${id}`,
    edit: (id) => `/users/${id}/edit`,
  },
  addresses: {
    root: `/addresses`,
    list: `/addresses/list`,
    details: (id) => `/addresses/${id}`,
    edit: (id) => `/addresses/${id}/edit`,
  },
  categories: {
    root: `/categories`,
    list: `/categories/list`,
    details: (id) => `/categories/${id}`,
    edit: (id) => `/categories/${id}/edit`,
  },

  subCategories: {
    root: `/subCategories`,
    list: `/subCategories/list`,
    details: (id) => `/subCategories/${id}`,
    edit: (id) => `/subCategories/${id}/edit`,
  },
  products: {
    root: `/products`,
    list: `/products/list`,
    details: (id) => `/products/${id}`,
    edit: (id) => `/products/${id}/edit`,
  },
  courses: {
    root: `/courses`,
    list: `/courses/list`,
    details: (id) => `/courses/${id}`,
    edit: (id) => `/courses/${id}/edit`,
  },
  plans: {
    root: `/plans`,
    list: `/plans/list`,
    details: (id) => `/plans/${id}`,
    edit: (id) => `/plans/${id}/edit`,
  },
  settings: '/settings',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
};
