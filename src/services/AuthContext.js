import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Extract token from localStorage before the useEffect runs
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 > Date.now()) {
          setUserId(decoded.id || "");
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
          setUserId("");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
        localStorage.removeItem("token");
        setUserId("");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [token]); // Simple dependency

  const logout = () => {
    localStorage.removeItem("token");
    setUserId("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
