import React, { useState, createContext } from "react";

export const MarketContext = createContext({});

export const MarketContextProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [isConnect, setIsConnect] = useState(false);
  console.log('provider render')
  const [connectionButtonName, setConnectionButtonName] =  useState('Connect Wallet')

  return (
    <MarketContext.Provider
      value={{ address, setAddress, isConnect, setIsConnect,connectionButtonName,setConnectionButtonName }}
    >
         {children}
    </MarketContext.Provider>
  );
};
