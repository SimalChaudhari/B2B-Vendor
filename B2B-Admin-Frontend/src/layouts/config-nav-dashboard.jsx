import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;
const userRole = JSON.parse(localStorage.getItem("userData"))?.user.role

// const AuthAdmin = userRole && userRole === "Admin" 

const ICONS = {
  dashboard: icon('ic-dashboard'),
  // users: icon('ic-user'),
  products: icon('ic-product'),
  vendors: icon('ic-kanban'),
  orders: icon('ic-order'),
  settings: icon('ic-lock'),
};



export const navData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },

  {
    subheader: 'Management',
    items: [

      ...(userRole === 'Admin' ? [
        // { title: 'Users', path: paths.users.root, icon: ICONS.users },
        { title: 'Products', path: paths.products.root, icon: ICONS.products },
        { title: 'Vendors', path: paths.vendors.root, icon: ICONS.vendors },
        { title: 'Orders', path: paths.orders.root, icon: ICONS.orders }, {
          title: 'Settings',
          path: paths.settings.root,
          icon: ICONS.settings,
          children: [
            { title: 'FAQ', path: paths.settings.faq },
            { title: 'Contact us', path: paths.settings.contact_us },
            { title: 'Terms Conditions', path: paths.settings.terms_conditions },
            { title: 'General Setting', path: paths.settings.general_settings },
          ],
        },
      ] : []),


      ...(userRole === 'Vendor' ? [
        {title: 'Products', path: paths.items.root, icon: ICONS.products},
        {title: 'Orders', path: paths.orders.root, icon: ICONS.orders },
      ] : []),
    ],
  },

];

