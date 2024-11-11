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
            { title: 'Stocks Summary', path: paths.stocks.root, icon: ICONS.stocks },

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
      ],
    },
  ];

  return navData;
};
