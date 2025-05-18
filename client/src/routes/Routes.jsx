import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DefaultLayout } from "../DefaultLayout/DefaultLayout";
import { coinDetails, dashboard,  login, news, signup, watchlist } from "./Routelink";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CoinDetails from "../pages/CoinDetails";
import Watchlist from "../pages/Watchlist";
import Dashboard from "../pages/Dashboard";
import News from "../pages/News";



const route = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
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
        element: <Watchlist />
      },
      {
        path: dashboard,
        element: <Dashboard />
      },
      {
        path: news,
        element: <News />
      }
    ]
  }
])

export const Routes = () => {
  return (
    <RouterProvider router={route} />
  )

}