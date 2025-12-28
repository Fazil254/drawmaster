import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("loggedUser");
    if (storedLogin === "true" && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedUser", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedUser");
    setIsLoggedIn(false);
    setUser(null);
  };
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
