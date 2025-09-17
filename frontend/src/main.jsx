// src/main.jsx (UPDATED)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './Home.jsx';
import Login from './login.jsx';
import RoleSelection from './RoleSelection.jsx'; // 👈 Import RoleSelection
import DashboardRouter from './dashboard/DashboardRouter.jsx'; // 👈 Import new DashboardRouter
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
// The rest of your code remains the same

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/select-role', // 👈 Add the new route
    element: <RoleSelection />,
  },
  {
    path: '/dashboard', // 👈 Change this to use the new router
    element: <DashboardRouter />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-e8w64u7surs6l35j.us.auth0.com"
      clientId="dWhv1ZOA2XS2pkMpO3up4ER1DKJKkUZW"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProvider router={Router} />
    </Auth0Provider>
  </StrictMode>
);