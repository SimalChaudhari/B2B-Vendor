import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const CompaniesPage = lazy(() => import('src/pages/companies'));
const UsersPage = lazy(() => import('src/pages/users'));
const AddressesPage = lazy(() => import('src/pages/users/address/index'));
const CategoryPage = lazy(() => import('src/pages/categories'));
const SubCategoryPage = lazy(() => import('src/pages/subCategories'));
const ProductPage = lazy(() => import('src/pages/products'));

const CoursesPage = lazy(() => import('src/pages/courses'));
const PlansPage = lazy(() => import('src/pages/plans'));

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
    path: 'addresses',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <AddressesPage />, index: true },
    ],
  },
  {
    path: 'categories',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <CategoryPage />, index: true },
    ],
  },
  {
    path: 'subCategories',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <SubCategoryPage />, index: true },
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
    path: 'courses',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <CoursesPage />, index: true },
    ],
  },
  {
    path: 'plans',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <PlansPage />, index: true },
    ],
  },
  { path: '500', element: <Page500 /> },
  { path: '404', element: <Page404 /> },
  { path: '403', element: <Page403 /> },
];
