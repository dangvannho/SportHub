import { useState, createContext } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [ownerData, setOwnerData] = useState(() => {
    const savedUser = localStorage.getItem("owner");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  return (
    <AppContext.Provider
      value={{ userData, setUserData, ownerData, setOwnerData }}
    >
      {children}
    </AppContext.Provider>
  );
};
