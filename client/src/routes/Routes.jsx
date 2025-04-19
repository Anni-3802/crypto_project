import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DefaultLayout } from '../Layout/DefaultLayout'
import Home from '../pages/Home'
import { coinDetails, dashboard, login, signup, watchlist } from './RoutesLink'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import CoinDetails from '../pages/CoinDetails'
import Watchlist from '../pages/Watchlist'
import ProtectedRoute from '../components/ProctectedRoute'
import Dashboard from '../pages/Dashboard'


export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [{
      path: "/",
      element: <Home />
    },
    {
      path: login,
      element: <Login />
    },
    {
      path: signup,
      element: <Signup />
    },
    {
      path: coinDetails,
      element: <CoinDetails />
    },
    {
      path: watchlist,
      element: <ProtectedRoute><Watchlist /></ProtectedRoute>
    }, {
      path: dashboard,
      element: <Dashboard />
    }
    ]
  }
])

export const Routes = () => {
  return (
    <RouterProvider router={router} />
  )
}
