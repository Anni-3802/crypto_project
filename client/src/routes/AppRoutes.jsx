import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import CoinDetails from "../pages/CoinDetails";
import Watchlist from "../pages/Watchlist";
import ProtectedRoute from "../components/ProctectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/" element={<Home />} />
    <Route path="/coin/:id" element={<CoinDetails />} />
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
