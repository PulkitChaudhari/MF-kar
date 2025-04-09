"use client";
import React, { useState } from "react";
import { PortfolioProvider } from "./PortfolioContext";
import { BacktestProvider } from "./BacktestContext";
import { UIProvider } from "./UIContext";

// Combined provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // States that need to be shared between contexts
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("1");
  const [initialAmount, setInitialAmount] = useState<string>("100");
  const [investmentMode, setInvestmentMode] = useState<string>("lumpsum");

  return (
    <UIProvider>
      <PortfolioProvider>
        <BacktestProvider
          selectedTimePeriodState={[selectedTimePeriod, setSelectedTimePeriod]}
          initialAmountState={[initialAmount, setInitialAmount]}
          investmentModeState={[investmentMode, setInvestmentMode]}
        >
          {children}
        </BacktestProvider>
      </PortfolioProvider>
    </UIProvider>
  );
};

// For simplicity in importing all contexts
export * from "./PortfolioContext";
export * from "./BacktestContext";
export * from "./UIContext";
