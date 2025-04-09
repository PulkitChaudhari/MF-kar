"use client";
import React from "react";
import { Input, Tab, Tabs } from "@nextui-org/react";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";

export default function PortfolioInvestmentAmountComponent({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const { initialAmount, investmentMode, setInitialAmount, setInvestmentMode } =
    usePortfolioContext();

  return (
    <div className="my-1 flex flex-col gap-1">
      <div className="flex items-center my-2">
        <div className="h-[1px] bg-gray-300 flex-grow"></div>
        <b className="mx-3 text-sm whitespace-nowrap">Investment Amount</b>
        <div className="h-[1px] bg-gray-300 flex-grow"></div>
      </div>
      <div className="flex flex-col gap-2 justify-end">
        <div className="flex w-full gap-2 items-center">
          <Input
            type="number"
            value={initialAmount}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">₹</span>
              </div>
            }
            variant="bordered"
            onValueChange={(val) => setInitialAmount(val)}
            name="portfolioName"
            isDisabled={isLoading}
            size="md"
            placeholder="Initial Amount"
            // labelPlacement="outside-left"
            labelPlacement="inside"
          />
          <Tabs
            aria-label="Options"
            fullWidth
            selectedKey={investmentMode}
            size="md"
            onSelectionChange={(tabIndex) =>
              setInvestmentMode(tabIndex == 0 ? "lumpsum" : "monthly-sip")
            }
            isDisabled={isLoading}
            variant="bordered"
          >
            <Tab key="lumpsum" title="Lumpsum"></Tab>
            <Tab key="monthly-sip" title="Monthly Sip"></Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
