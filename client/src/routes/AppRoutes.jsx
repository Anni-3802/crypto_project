import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import CoinDetails from "../pages/CoinDetails";
import Watchlist from "../pages/Watchlist";
import ProtectedRoute from "../components/ProctectedRoute";
import News from "../pages/News";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Home />} />
    <Route path="/coin-details/:id" element={<CoinDetails />} />
    <Route path="/news" element={<News />} />
    <Route
      path="/watchlist"
      element={
        <ProtectedRoute>
          <Watchlist />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
