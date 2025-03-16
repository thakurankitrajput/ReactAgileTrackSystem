import React, { createContext, useContext, useState, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

// UserProvider Component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage on initial load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:4000/users?email=${email}&password=${password}`);
      const data = await response.json();

      if (data.length > 0) {
        const loggedInUser = data[0];
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser)); // Store user in localStorage
        return true; // Return user role for redirection
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to use UserContext in other components
const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
