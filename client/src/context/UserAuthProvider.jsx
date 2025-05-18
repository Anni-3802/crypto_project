import React, { useEffect, useState } from 'react'
import { getToken, removeToken, setToken } from '../utils/auth'
import { UserAuth } from './UserAuth'

export const UserAuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!getToken());

  const login = (token) => {
    setToken(token);
    setIsUserLoggedIn(true);
  };

  const logout = () => {
    removeToken();
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    const token = getToken();
    setIsUserLoggedIn(!!token);
  }, []);

  return (
    <UserAuth.Provider value={{ login, logout, isUserLoggedIn }}>
      {children}
    </UserAuth.Provider>
  );
};
