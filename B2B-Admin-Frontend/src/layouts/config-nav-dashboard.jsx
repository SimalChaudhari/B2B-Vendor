import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  dashboard: icon('ic-dashboard'),
  users: icon('ic-user'),
  addresses: icon('ic-banking'),
  categories: icon('ic-blog'),
  subCategories: icon('ic-menu-item'),
  products: icon('ic-product'),
  courses: icon('ic-course'),
  plans: icon('ic-blog'),
  settings: icon('ic-lock'),
};

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }
    ],
  },

  {
    subheader: 'Management',
    items: [
      { title: 'Users', path: paths.users.root, icon: ICONS.users },
      { title: 'Addresses', path: paths.addresses.root, icon: ICONS.addresses },
      { title: 'Categories', path: paths.categories.root, icon: ICONS.categories },
      { title: 'SubCategories', path: paths.subCategories.root, icon: ICONS.subCategories },
      { title: 'Products', path: paths.products.root, icon: ICONS.products },

      { title: 'Courses', path: paths.courses.root, icon: ICONS.courses },
      { title: 'Plans', path: paths.plans.root, icon: ICONS.plans },
      { title: 'Settings', path: paths.settings, icon: ICONS.settings },
    ],
  },
];
