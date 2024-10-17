import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';
import { ProductEditView, ProductView } from 'src/sections/product/view';
import { FAQCreateView, FAQEditView, FAQView } from 'src/sections/setting/FAQ/view';
import { ContactCreateView, ContactEditView, ContactView } from 'src/sections/setting/Contact-us/view';
import { TermCreateView, TermEditView, TermView } from 'src/sections/setting/terms-conditions/view';
import { VendorView } from 'src/sections/vendor/view/vendor-view';
import { VendorEditView } from 'src/sections/vendor/view/vendor-edit';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const UsersPage = lazy(() => import('src/pages/users'));
const ProductPage = lazy(() => import('src/pages/products'));
const OrderPage = lazy(() => import('src/pages/orders'));

const VendorPage = lazy(() => import('src/pages/vendors'));

const FAQPage = lazy(() => import('src/pages/settings/faq'));
const ContactPage = lazy(() => import('src/pages/settings/contact-us'));
const TermsPage = lazy(() => import('src/pages/settings/terms-conditions'));
const GeneralPage = lazy(() => import('src/pages/settings/general'));

// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
    ],
  },
  {
    path: 'users',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <UsersPage />, index: true },
    ],
  },
  {
    path: 'products',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <ProductPage />, index: true },
      { path: 'edit/:id', element: <ProductEditView /> },
      { path: 'view/:id', element: <ProductView /> },

    ],
  },
  {
    path: 'vendors',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <VendorPage />, index: true },
      { path: 'edit/:id', element: <VendorEditView /> },
      { path: 'view/:id', element: <VendorView /> },

    ],
  },

  {
    path: 'Orders',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <OrderPage />, index: true },
      { path: 'edit/:id', element: <ProductEditView /> },
      { path: 'view/:id', element: <ProductView /> },

    ],
  },


  {
    path: 'settings',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <FAQPage />, index: true },

      { path: 'faq', element: <FAQPage /> },
      { path: 'faq/create', element: <FAQCreateView /> },
      { path: 'faq/edit/:id', element: <FAQEditView /> },
      { path: 'faq/view/:id', element: <FAQView /> },

      { path: 'contact-us', element: <ContactPage /> },
      { path: 'contact-us/create', element: <ContactCreateView /> },
      { path: 'contact-us/edit/:id', element: <ContactEditView /> },
      { path: 'contact-us/view/:id', element: <ContactView /> },


      // { path: 'privacy-policy', element: <PrivacyPage /> },

      { path: 'terms-conditions', element: <TermsPage /> },
      { path: 'terms-conditions/create', element: <TermCreateView /> },
      { path: 'terms-conditions/edit/:id', element: <TermEditView /> },
      { path: 'terms-conditions/view/:id', element: <TermView /> },

      { path: 'general-settings', element: <GeneralPage /> },


    ],
  },

  { path: '500', element: <Page500 /> },
  { path: '404', element: <Page404 /> },
  { path: '403', element: <Page403 /> },
];
