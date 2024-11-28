// import { Navigate, useRoutes } from 'react-router-dom';
// import { authRoutes } from './auth';
// import { adminRoute } from './adminRoutes';
// import { vendorRoutes } from './vendorRoute';
// import { useEffect, useState } from 'react';

// export function Router() {
//   const [userRole, setUserRole] = useState(null);
//   const [isRoleFetched, setIsRoleFetched] = useState(false); // Track role fetch status

//   useEffect(() => {
//     const handleRoleChange = () => {
//       const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//       setUserRole(userData?.user?.role || null);
//       setIsRoleFetched(true); // Mark as fetched
//     };

//     window.addEventListener('storage', handleRoleChange);
//     handleRoleChange(); // Initial fetch

//     return () => {
//       window.removeEventListener('storage', handleRoleChange);
//     };
//   }, []);

//   // Define general routes
//   const baseRoutes = [
//     {
//       path: '/',
//       element: <Navigate to="/dashboard" replace />,
//     },
//     ...authRoutes,
//   ];

//   // Add role-specific routes only when `userRole` is known
//   const roleSpecificRoutes =
//     userRole === 'Admin'
//       ? adminRoute
//       : userRole === 'Vendor'
//       ? vendorRoutes
//       : [];

//   const routes = [
//     ...baseRoutes,
//     ...roleSpecificRoutes,
//     { path: '*', element: <Navigate to="/404" replace /> },
//   ];

//   // Always call `useRoutes`
//   const element = useRoutes(routes);

//   // Show a loading indicator while waiting for `userRole` to load
//   if (!isRoleFetched) {
//     return <div>Loading...</div>;
//   }

//   return element;
// }


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
