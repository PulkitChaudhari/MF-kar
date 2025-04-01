"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { FaRegEdit, VscGraphLine } from "../app/icons";

export default function PortfolioEditBacktestButtonComponent({
  isEditFunds,
  backtestPortfolio,
  isLoading,
  selectedInstrumentsData,
  setIsEditFunds,
}: {
  isEditFunds: any;
  backtestPortfolio: any;
  isLoading: any;
  selectedInstrumentsData: any;
  setIsEditFunds: any;
}) {
  return (
    <div className="flex w-full gap-2 px-5">
      {isEditFunds ? (
        <Button
          variant="bordered"
          className="w-full"
          onPress={() => backtestPortfolio()}
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
