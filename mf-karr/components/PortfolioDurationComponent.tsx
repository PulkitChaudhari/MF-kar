"use client";
import React from "react";
import { Button, DateInput } from "@nextui-org/react";
import { RxCross2, CalendarIcon } from "../app/icons";
import { cagrValues } from "../app/constants";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";
import { useBacktestContext } from "@/app/contexts/BacktestContext";

export default function PortflioDurationComponent() {
  const { isCustomTimePeriod, startDate, endDate, setIsCustomTimePeriod } =
    usePortfolioContext();

  const { selectedTimePeriod, setSelectedTimePeriod } = useBacktestContext();

  return (
    <div className="mt-1 flex flex-col gap-1">
      <div className="flex items-center my-2">
        <div className="h-[1px] bg-gray-300 flex-grow"></div>
        <b className="mx-3 text-sm whitespace-nowrap">Edit Time period</b>
        <div className="h-[1px] bg-gray-300 flex-grow"></div>
      </div>
      <div className="mx-[5px]">
        {isCustomTimePeriod ? (
          <div className="flex gap-2 items-end overflow-y-auto">
            <DateInput
              label="From"
              labelPlacement="outside"
              startContent={
                <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              size="sm"
              variant="flat"
              className="dark:bg-stone-800"
              value={startDate}
            />
            <DateInput
              label="To"
              labelPlacement="outside"
              startContent={
                <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              size="sm"
              variant="flat"
              className="dark:bg-stone-800"
              value={endDate}
            />
            <Button
              variant="bordered"
              size="sm"
              onPress={() => {
                setIsCustomTimePeriod(false);
              }}
            >
              <RxCross2 />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full overflow-y-auto">
            {cagrValues.map((year) => {
              return (
                <Button
                  variant="flat"
                  className="dark:bg-stone-800 w-full"
                  size="sm"
                  key={year.key}
                  onPress={() => setSelectedTimePeriod(year.key)}
                  isDisabled={selectedTimePeriod == year.key}
                >
                  {year.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
