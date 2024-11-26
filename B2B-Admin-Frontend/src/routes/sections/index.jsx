import { Navigate, useRoutes } from 'react-router-dom';
import { authRoutes } from './auth';
import { adminRoute } from './adminRoutes';
import { vendorRoutes } from './vendorRoute';
import { useEffect, useState } from 'react';

export function Router() {
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

  // Default routes to prevent conditional hook call
  const routes = [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    // Auth
    ...authRoutes,

    // Role-Specific Routes
    ...(userRole === 'Admin'
      ? adminRoute
      : userRole === 'Vendor'
      ? vendorRoutes
      : []),

    // Fallback for undefined routes
    { path: '*', element: <Navigate to="/404" replace /> },
  ];

  // Always call useRoutes
  const element = useRoutes(routes);

  // Use a loading indicator if userRole is null
  if (userRole === null) {
    return <div>Loading...</div>;
  }

  return element;
}

// import { Navigate, useRoutes } from 'react-router-dom';
// import { authRoutes } from './auth';
// import { dashboardRoutes } from './dashboard';

// export function Router() {
//   return useRoutes([
//     {
//       path: '/',
//       element: <Navigate to="/dashboard" replace />,
//     },
//     // Auth
//     ...authRoutes,

//     // Dashboard
//     ...dashboardRoutes,
//     { path: '*', element: <Navigate to="/404" replace /> },
//   ]);
// }
