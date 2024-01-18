"use client";
import {createContext, useState, useContext, useCallback} from "react";

// Create a context
export const SignerContext = createContext(null);

// Create a provider component
export const SignerProvider = ({children}) => {
  const [signer, setSigner] = useState(null);

  const updateSigner = useCallback((newSigner) => {
    setSigner(newSigner);
  }, []);

  return (
    <SignerContext.Provider value={{signer, updateSigner}}>
      {children}
    </SignerContext.Provider>
  );
};

// Hook for components to get the signer object and re-render when it changes
export const useSigner = () => useContext(SignerContext);
