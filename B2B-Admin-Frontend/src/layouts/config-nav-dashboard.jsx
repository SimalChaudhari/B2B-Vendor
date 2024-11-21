import { useEffect, useState } from 'react';
import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic-dashboard'),
  products: icon('ic-product'),
  vendors: icon('ic-kanban'),
  orders: icon('ic-order'),
  settings: icon('ic-lock'),
  stocks: icon('ic-job'),
  ledger: icon('ic-invoice'),
  logout: icon('ic-external'),
  account: icon('ic-tour'),
  analytics: icon('ic-analytics'),
  receivables: icon('ic-ecommerce'),
};

export const useNavData = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const handleRoleChange = () => {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setUserRole(userData?.user?.role || null);
    };

    window.addEventListener('storage', handleRoleChange);
    handleRoleChange(); // Initial fetch

    return () => {
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const commonItems = [
    { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
    { title: 'Logout', path: paths.logout.root, icon: ICONS.logout },
  ];

  const adminItems = [
    {
      subheader: 'Management',
      items: [
        { title: 'Products', path: paths.products.root, icon: ICONS.products },
        { title: 'Vendors', path: paths.vendors.root, icon: ICONS.vendors },
        { title: 'Orders', path: paths.orders.root, icon: ICONS.orders },
      ],
    },

  ];

  const reportsItem = [
    {
      subheader: 'Reports',
      items: [
        {
          title: 'Accounting',
          path: paths.accounts.root,
          icon: ICONS.account,
          children: [
            { title: 'Ledger Statement', path: paths.accounts.ledger },
            { title: 'Outstanding Receivables', path: paths.accounts.receivable },
          ],
        },
        {
          title: 'Inventory',
          path: paths.stocks.root,
          icon: ICONS.stocks,
          children: [{ title: 'Stocks', path: paths.stocks.root }],
        },



      ],
    }

  ]

  const vendorItems = [
    {
      subheader: 'Management',
      items: [
        { title: 'Products', path: paths.items.root, icon: ICONS.products },
        { title: 'Orders', path: paths.orders.root, icon: ICONS.orders },
      ],
    },

  ];

  const vendorSettingsItem = [
    {
      subheader: 'Settings',
      items: [
        {
          title: 'Profile',
          path: paths.settings.profile,
          icon: ICONS.settings,
        },
      ],
    },
  ]

  const settingsItems = [
    {
      subheader: 'Settings',
      items: [
        {
          title: 'Settings',
          path: paths.settings.root,
          icon: ICONS.settings,
          children: [
            { title: 'FAQs', path: paths.settings.faq },
            { title: 'Contact Us', path: paths.settings.contact_us },
            { title: 'Terms & Conditions', path: paths.settings.terms_conditions },
            { title: 'Banner', path: paths.settings.banner },
            { title: 'Sync Data', path: paths.settings.sync },
            { title: 'Profile', path: paths.settings.profile },
          ],
        },
      ],
    },
  ];


  const logsHistory = [
    {
      subheader: 'Logs',
      items: [
        { title: 'Logs', path: paths.logs.root, icon: ICONS.dashboard },
      ],
    },

  ];

  const navData = [
    ...commonItems,
    ...(userRole === 'Admin' ? [...adminItems, ...reportsItem, ...settingsItems, ...logsHistory] : []),
    ...(userRole === 'Vendor' ? [...vendorItems, ...reportsItem, ...vendorSettingsItem] : []),
  ];

  return navData;
};
