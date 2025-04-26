import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isLogined } = useContext(AuthContext)
  return (
    isLogined ? children : <Navigate to="/"/>
  )
};

export default ProtectedRoute;
