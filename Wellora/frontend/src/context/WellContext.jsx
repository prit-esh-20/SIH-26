import { createContext, useContext, useState } from "react";

const WellContext = createContext(null);

export function WellProvider({ children }) {
  const [activeWellId, setActiveWellId] = useState("W-205");
  return (
    <WellContext.Provider value={{ activeWellId, setActiveWellId }}>
      {children}
    </WellContext.Provider>
  );
}

export function useWellContext() {
  const ctx = useContext(WellContext);
  if (!ctx) {
    throw new Error("useWellContext must be used within a WellProvider");
  }
  return ctx;
}
