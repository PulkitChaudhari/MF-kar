"use client";
import React from "react";
import { Input, Tab, Tabs } from "@nextui-org/react";

export default function PortfolioInvestmentAmountComponent({
  initialAmount,
  setInitialAmount,
  isLoading,
  investmentMode,
  setInvestmentMode,
}: {
  initialAmount: any;
  setInitialAmount: any;
  isLoading: any;
  investmentMode: any;
  setInvestmentMode: any;
}) {
  return (
    <div className="my-1 flex flex-col gap-1">
      <div className="flex items-center my-2">
        <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
        <b className="mx-3 text-sm whitespace-nowrap">Investment Amount</b>
        <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
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
            onSelectionChange={setInvestmentMode}
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
