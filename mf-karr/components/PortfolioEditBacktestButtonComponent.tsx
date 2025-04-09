"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { FaRegEdit, VscGraphLine } from "../app/icons";
import { useBacktestContext } from "@/app/contexts/BacktestContext";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";

export default function PortfolioEditBacktestButtonComponent({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: any;
}) {
  // Function to handle backtesting the portfolio
  const handleBacktestPortfolio = async () => {
    setIsLoading(true);
    try {
      await backtestPortfolio(
        selectedInstrumentsData,
        Number(selectedTimePeriod),
        Number(initialAmount),
        investmentMode
      );
    } finally {
      setIsLoading(false);
    }
  };

  const {
    selectedInstrumentsData,
    selectedTimePeriod,
    initialAmount,
    investmentMode,
  } = usePortfolioContext();

  const { isEditFunds, backtestPortfolio, setIsEditFunds } =
    useBacktestContext();

  return (
    <div className="flex w-full gap-2 px-5 mb-2">
      {isEditFunds ? (
        <Button
          variant="flat"
          className="w-full bg-stone-800"
          onPress={() => handleBacktestPortfolio()}
          isDisabled={
            isLoading || Object.keys(selectedInstrumentsData).length === 0
          }
        >
          Backtest <VscGraphLine />
        </Button>
      ) : (
        <Button
          variant="bordered"
          className="w-full"
          onPress={() => setIsEditFunds(true)}
        >
          Edit Funds <FaRegEdit />
        </Button>
      )}
    </div>
  );
}
