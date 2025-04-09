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
    <div className="mb-1 flex flex-col gap-1">
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
            classNames={{
              label: "bg-stone-800",
              input: ["bg-stone-800"],
              innerWrapper: "bg-stone-800",
              inputWrapper: [
                "bg-stone-800",
                "dark:bg-stone-800",
                "hover:bg-stone-800",
                "dark:hover:bg-stone-800",
                "group-data-[focus=true]:bg-stone-800",
                "dark:group-data-[focus=true]:bg-stone-800",
              ],
            }}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">₹</span>
              </div>
            }
            variant="flat"
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
            onSelectionChange={(tabIndex) => {
              setInvestmentMode(tabIndex);
            }}
            isDisabled={isLoading}
            variant="solid"
            classNames={{
              base: ["dark:bg-stone-800"],
              tabList: ["dark:bg-stone-800"],
              tab: ["dark:bg-stone-800"],
              panel: [
                "bg-stone-800",
                "dark:bg-stone-800",
                "hover:bg-stone-800",
                "dark:hover:bg-stone-800",
              ],
              wrapper: "dark:bg-stone-800",
              cursor: "dark:bg-stone-700",
            }}
            className="rounded-lg"
          >
            <Tab
              key="lumpsum"
              title="Lumpsum"
              // className="dark:bg-stone-800"
            ></Tab>
            <Tab
              key="monthly-sip"
              title="Monthly Sip"
              // className="dark:bg-stone-800"
            ></Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
