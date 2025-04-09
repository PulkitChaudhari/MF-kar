"use client";
import React, { useState } from "react";
import { IoLockClosed } from "../app/icons";
import { useBacktestContext } from "../app/contexts/BacktestContext";
import ReplacePortfolioModalComponent from "./ReplacePortfolioModalComponent";
import LoadPortfolioModalComponent from "./LoadPortfolioModalComponent";
import PortfolioNameComponent from "./PortfolioNameComponent";
import PortfolioToolbarComponent from "./PortfolioToolbarComponent";
import PortflioDurationComponent from "./PortfolioDurationComponent";
import PortfolioInstrumentsComponent from "../app/PortfolioInstrumentsComponent";
import PortfolioInvestmentAmountComponent from "./PortfolioInvestmentAmountComponent";
import PortfolioEditBacktestButtonComponent from "./PortfolioEditBacktestButtonComponent";
import PortfolioSearchComponent from "./PortfolioSearchComponent";
import PortfolioChartComponent from "../app/PortfolioChartComponent";
import LoadingOverlayComponent from "./LoadingOverlayComponent";

export default function PortfolioContentComponent() {
  const { isEditFunds } = useBacktestContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="h-full w-full ">
      <ReplacePortfolioModalComponent setIsLoading={setIsLoading} />
      <LoadPortfolioModalComponent setIsLoading={setIsLoading} />
      <div className="w-full h-full flex relative">
        <div className="gap-2 w-4/12 flex flex-col ml-2 mr-1 py-2 my-2 rounded-lg bg-gray-500 dark:bg-black overflow-y-auto">
          <div className="relative flex flex-col gap-2 rounded-lg grow px-5 pt-5">
            <div className="flex items-center gap-2">
              <PortfolioNameComponent />
              <PortfolioToolbarComponent
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            </div>
            <PortfolioInstrumentsComponent setIsLoading={setIsLoading} />
            <PortflioDurationComponent />
            <PortfolioInvestmentAmountComponent isLoading={isLoading} />
            {!isEditFunds && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-lg flex flex-col gap-2 text-center items-center justify-center">
                <IoLockClosed className="text-foreground-400" />
                Please edit funds to unlock this section
              </div>
            )}
          </div>
          <PortfolioEditBacktestButtonComponent
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        </div>
        <div className="gap-2 h-full w-8/12 flex flex-col">
          <div className="flex flex-col h-full p-5 my-2 ml-1 mr-2 overflow-y-auto dark:bg-black  rounded-lg">
            <div className="flex flex-col gap-3 w-full">
              {isEditFunds ? (
                <PortfolioSearchComponent
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              ) : (
                <PortfolioChartComponent isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>
        {isLoading && <LoadingOverlayComponent message="Loading data" />}
      </div>
    </div>
  );
}
