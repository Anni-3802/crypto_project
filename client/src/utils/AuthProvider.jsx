import { useEffect, useState } from 'react';
import { isLogin, removeToken, setToken } from './auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [isLogined, setIsLogined] = useState(isLogin());

  const login = (token) => {
    setToken(token);
    setIsLogined(true);
  };

  const logout = () => {
    removeToken();
    setIsLogined(false);
  };

  return (
    <AuthContext.Provider value={{ isLogined, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
