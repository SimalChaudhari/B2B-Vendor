import { Navigate, useRoutes } from 'react-router-dom';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
