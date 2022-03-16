import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);

  return (
    <UserContext.Provider value={{ characters, setCharacters }}>
      {children}
    </UserContext.Provider>
  );
};
