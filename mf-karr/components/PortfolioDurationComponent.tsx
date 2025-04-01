"use client";
import React from "react";
import { Button, DateInput } from "@nextui-org/react";
import { RxCross2, CalendarIcon } from "../app/icons";
import { cagrValues } from "../app/constants";

export default function PortflioDurationComponent({
  isCustomTimePeriod,
  startDate,
  endDate,
  setIsCustomTimePeriod,
  setSelectedTimePeriod,
  selectedTimePeriod,
}: {
  isCustomTimePeriod: any;
  startDate: any;
  endDate: any;
  setIsCustomTimePeriod: any;
  setSelectedTimePeriod: any;
  selectedTimePeriod: any;
}) {
  return (
    <div className="my-1 flex flex-col gap-1">
      <div className="flex items-center my-2">
        <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
        <b className="mx-3 text-sm whitespace-nowrap">Edit Time period</b>
        <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
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
              value={startDate}
            />
            <DateInput
              label="To"
              labelPlacement="outside"
              startContent={
                <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              size="sm"
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
                  variant="bordered"
                  size="sm"
                  key={year.key}
                  className="w-full"
                  onPress={() => setSelectedTimePeriod(year.key)}
                  isDisabled={selectedTimePeriod == year.key}
                >
                  {year.label}
                </Button>
              );
            })}
            {/* <Button
                          className="flex-1"
                          variant="bordered"
                          size="sm"
                          onPress={() => {
                            setIsCustomTimePeriod(true);
                          }}
                        >
                          Custom
                        </Button> */}
          </div>
        )}
      </div>
    </div>
  );
}
