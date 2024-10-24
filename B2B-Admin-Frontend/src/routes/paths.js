
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
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
  },

  vendors: {
    root: `/vendors`,
    list: `/vendors/list`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
  },
  orders: {
    root: `/orders`,
    list: `/orders/list`,
    details: (id) => `/orders/${id}`,
  },

  settings: {
    root: `/settings`,
    faq: `/settings/faq`,
    create: `/create`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,

    contact_us: `/settings/contact-us`,
    createContact: `/create`,
    editContact: (id) => `/edit/${id}`,
    viewContact: (id) => `/view/${id}`,

    // privacy_policy: `/settings/privacy-policy`,
    terms_conditions: `/settings/terms-conditions`,
    createTerm: `/create`,
    editTerm: (id) => `/edit/${id}`,
    viewTerm: (id) => `/view/${id}`,

    general_settings: `/settings/general-settings`,
    profile: `/settings/profile-settings`,

  },

  // Vendor  Panel 
  items: {
    root: `/items`,
    list: `/items/list`,
    checkout: `/items/checkout`,
    details: (id) => `/items/${id}`,
    edit: (id) => `/edit/${id}`,
    view: (id) => `/view/${id}`,
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
