import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './login.jsx'
import Home from './Home.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

const Router=createBrowserRouter([
  {
    path :'/',
    element : <Home/>,
  },
  {
    path : '/login',
    element : <Login />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-e8w64u7surs6l35j.us.auth0.com"     
      clientId="dWhv1ZOA2XS2pkMpO3up4ER1DKJKkUZW" 
      authorizationParams={{
        redirect_uri: window.location.origin 
      }}
    >
      <RouterProvider router={Router} />
    </Auth0Provider>
  </StrictMode>,
)
