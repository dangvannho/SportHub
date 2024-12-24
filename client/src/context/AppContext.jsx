import { useState, createContext } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [ownerData, setOwnerData] = useState(() => {
    const savedOwner = localStorage.getItem("owner");
    return savedOwner ? JSON.parse(savedOwner) : null;
  });

  const [searchCriteria, setSearchCriteria] = useState({
    typeField: "all",
    fieldName: "",
    fieldAddress: "",
  });
  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        ownerData,
        setOwnerData,
        searchCriteria,
        setSearchCriteria,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
