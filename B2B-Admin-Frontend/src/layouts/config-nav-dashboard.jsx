import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  dashboard: icon('ic-dashboard'),
  users: icon('ic-user'),
  categories: icon('ic-blog'),
  subCategories: icon('ic-menu-item'),
  products: icon('ic-product'),
  orders: icon('ic-order'),
  offers: icon('ic-menu-item'), // Add Offer Management icon
  returns: icon('ic-menu-item'), // Add Return Management icon
  couriers: icon('ic-menu-item'), // Add Courier Management icon
  settings: icon('ic-lock'),
};

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },

  /**
   * Management Section
   */
  {
    subheader: 'Management',
    items: [
      { title: 'Users', path: paths.users.root, icon: ICONS.users },
      { title: 'Categories', path: paths.categories.root, icon: ICONS.categories },
      { title: 'Sub Categories', path: paths.subCategories.root, icon: ICONS.subCategories },
      { title: 'Products', path: paths.products.root, icon: ICONS.products },
      { title: 'Orders', path: paths.orders.root, icon: ICONS.orders },
      { title: 'Offer Management', path: paths.offerManagement.root, icon: ICONS.offers }, // New Offer Management
      { title: 'Return Management', path: paths.returnManagement.root, icon: ICONS.returns }, // New Return Management
      { title: 'Courier Management', path: paths.courierManagement.root, icon: ICONS.couriers }, // New Courier Management
      {
        title: 'Settings',
        path: paths.settings.root,
        icon: ICONS.settings,
        children: [
          { title: 'Faq', path: paths.settings.faq },
          { title: 'Contact us', path: paths.settings.contact_us },
          { title: 'Privacy Policy', path: paths.settings.privacy_policy },
          { title: 'Terms Conditions', path: paths.settings.terms_conditions },
          { title: 'General Setting', path: paths.settings.general_settings },
        ],
      },
    ],
  },
];
