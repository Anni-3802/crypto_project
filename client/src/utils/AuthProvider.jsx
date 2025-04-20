import { useEffect, useState } from 'react';
import { isLogin, removeToken, setToken } from './auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [isLogined, setIsLogined] = useState(isLogin());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogined(isLogin());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
