import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);

  const login = (id) => {
    setUserID(id);
  };

  const logout = () => {
    setUserID(null);
  };

  return (
    <AuthContext.Provider value={{ userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};