import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const ProductPage = lazy(() => import('src/pages/products'));
const OrderPage = lazy(() => import('src/pages/orders'));
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
    path: 'products',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <ProductPage />, index: true },

    ],
  },
  {
    path: 'Orders',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <OrderPage />, index: true },


    ],
  },


  {
    path: 'settings',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { path: 'general-settings', element: <GeneralPage /> },
    ],
  },

  { path: '500', element: <Page500 /> },
  { path: '404', element: <Page404 /> },
  { path: '403', element: <Page403 /> },
];
