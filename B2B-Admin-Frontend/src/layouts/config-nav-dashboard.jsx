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
    // Retrieve user role from localStorage whenever it changes
    const handleRoleChange = () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      setUserRole(userData?.user?.role);
    };

    // Listen for storage events to detect changes (when user logs in/out from other tabs)
    window.addEventListener('storage', handleRoleChange);

    // Initial role fetch
    handleRoleChange();

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleRoleChange);
    };
  }, []);

  const navData = [
    {
      subheader: 'Overview',
      items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
    },
    {
      subheader: 'Management',
      items: [
        ...(userRole === 'Admin'
          ? [
            { title: 'Products', path: paths.products.root, icon: ICONS.products },
            { title: 'Vendors', path: paths.vendors.root, icon: ICONS.vendors },
            { title: 'Orders', path: paths.orders.root, icon: ICONS.orders },
           
            {
              title: 'Accounting Reports',
              path: paths.accounts.root,
              icon: ICONS.account,
              children: [
                { title: 'Ledger Statement', path: paths.accounts.ledger,icon: ICONS.analytics},
                { title: 'Outstanding Receivables', path: paths.accounts.receivable,icon: ICONS.receivables}
              ],
            },

            {
              title: 'Inventory Reports',
              path: paths.stocks.root,
              icon: ICONS.stocks,
              children: [
                { title: 'Stocks', path: paths.stocks.root, icon: ICONS.ledger },
              ],
            },



            {
              title: 'Settings',
              path: paths.settings.root,
              icon: ICONS.settings,
              children: [
                { title: 'FAQs', path: paths.settings.faq },
                { title: 'Contact us', path: paths.settings.contact_us },
                { title: 'Terms Conditions', path: paths.settings.terms_conditions },
                { title: 'Banner', path: paths.settings.banner },
                { title: 'Profile', path: paths.settings.profile },
              ],
            },
          ]
          : []),

        ...(userRole === 'Vendor'
          ? [
            { title: 'Products', path: paths.items.root, icon: ICONS.products },
            { title: 'Orders', path: paths.orders.root, icon: ICONS.orders },
            {
              title: 'Settings',
              path: paths.settings.root,
              icon: ICONS.settings,
              children: [{ title: 'Profile', path: paths.settings.profile }],
            },
          ]
          : []),

        { title: 'Logout', path: paths.logout.root, icon: ICONS.logout },

      ],
    },
  ];

  return navData;
};
