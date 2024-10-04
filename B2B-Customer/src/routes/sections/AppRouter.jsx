// src/routes/AppRouter.jsx
import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { SplashScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths'; // Import your paths

const SignIn = lazy(() => import('src/pages/auth/jwt/signin'));
// const SignUp = lazy(() => import('src/pages/auth/jwt/signup')); // Ensure this path is correct

export const AppRouter = () => {
  const routes = useRoutes([
    {
      path: paths.sign_In,
      element: (
        <Suspense fallback={<SplashScreen />}>
          <SignIn />
        </Suspense>
      ),
    },
    // {
    //   path: paths.sign_Up,
    //   element: (
    //     <Suspense fallback={<SplashScreen />}>
    //       <SignUp />
    //     </Suspense>
    //   ),
    // },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);

  return routes;
};
