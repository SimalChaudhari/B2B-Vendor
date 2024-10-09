
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
  products: {
    root: `/products`,
    list: `/products/list`,
    details: (id) => `/products/${id}`,
    // edit: (id) => `/products/${id}/edit`,
    edit:  (id) => `/edit/${id}`,
    view:  (id) => `/view/${id}`,


  },
  orders: {
    root: `/orders`,
    list: `/orders/list`,
    details: (id) => `/orders/${id}`,
  },
  offerManagement: {
    root: `/offers`,
    list: `/offers/list`,
    details: (id) => `/offers/${id}`,
  },
  returnManagement: {
    root: `/returns`,
    list: `/returns/list`,
    details: (id) => `/returns/${id}`,
  },
  courierManagement: {
    root: `/couriers`,
    list: `/couriers/list`,
    details: (id) => `/couriers/${id}`,
  },
  settings: {
    root: `/settings`,
    faq: `/settings/faq`,
    create:`/create`,
    edit:  (id) => `/edit/${id}`,
    view:  (id) => `/view/${id}`,
    contact_us: `/settings/contact-us`,
    privacy_policy: `/settings/privacy-policy`,
    terms_conditions: `/settings/terms-conditions`,
    general_settings: `/settings/general-settings`,
  },
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
