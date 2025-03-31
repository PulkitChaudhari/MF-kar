"use client";
import React, { createContext, useContext, useState } from "react";

// Define the context type
type InvestmentContextType = {
  initialAmount: string;
  investmentMode: string;

  // Investment actions
  setInitialAmount: (amount: string) => void;
  setInvestmentMode: (mode: string) => void;
};

// Create the context with default values
const InvestmentContext = createContext<InvestmentContextType>({
  initialAmount: "100",
  investmentMode: "lumpsum",

  // Default functions (will be overridden by provider)
  setInitialAmount: () => {},
  setInvestmentMode: () => {},
});

// Provider component
export const InvestmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initialAmount, setInitialAmount] = useState<string>("100");
  const [investmentMode, setInvestmentMode] = useState<string>("lumpsum");

  return (
    <InvestmentContext.Provider
      value={{
        initialAmount,
        investmentMode,
        setInitialAmount,
        setInvestmentMode,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
};

// Custom hook to use the investment context
export const useInvestmentContext = () => useContext(InvestmentContext);
