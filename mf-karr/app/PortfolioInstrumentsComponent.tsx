"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Input,
  Card,
} from "@nextui-org/react";

import { DeleteIcon } from "./icons";
import { columns } from "./constants";

import { Slider } from "@heroui/slider";
import { ValidationError } from "@react-types/shared";

export default function PortfolioInstrumentsComponent({
  selectedNavData,
  removeMututalFundFn,
  timePeriod,
  isAdjustWeightageEnabled,
  isSaveEnabled,
  tableDataWeightageCopy,
  setTableDataWeightageCopy,
  isLoading,
}: {
  selectedNavData: any[];
  removeMututalFundFn: any;
  timePeriod: Number;
  isAdjustWeightageEnabled: boolean;
  isSaveEnabled: any;
  tableDataWeightageCopy: any[];
  setTableDataWeightageCopy: any;
  isLoading: boolean;
}) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableHeaders, setTableHeaders] = useState<any[]>(columns);

  useEffect(() => {
    let tempTableData: any[] = [];
    Object.keys(selectedNavData).forEach((key: any) => {
      const instrumentInfo = selectedNavData[key];
      tempTableData.push({
        instrumentCode: key,
        instrumentName: instrumentInfo.instrumentName,
        cagr: instrumentInfo.cagr,
        weightage: instrumentInfo.weightage.toFixed(2),
      });
    });
    setTableData(tempTableData);
  }, [selectedNavData]);

  useEffect(() => {
    let toBeTableHeaders = [
      ...columns.map((column) => {
        return { ...column };
      }),
    ];
    toBeTableHeaders[1].label = timePeriod + "YR CAGR";
    setTableHeaders(toBeTableHeaders);
  }, [timePeriod]);

  useEffect(() => {
    isSaveEnabled(tableDataWeightageCopy);
  }, [tableDataWeightageCopy]);

  useEffect(() => {
    setTableDataWeightageCopy(tableData);
  }, [tableData]);

  function validateWeightage(value: any): true | ValidationError {
    const valueAsNum: number = Number(value);
    // Check if the value is between 0 and 100 and has at most 2 decimal places
    if (
      valueAsNum >= 0 &&
      valueAsNum <= 100 &&
      /^\d+(\.\d{1,2})?$/.test(value)
    ) {
      return true;
    }
    return "false"; // Return false if the conditions are not met
  }

  function changeWeightage(newValue: number | number[], row: any) {
    const tempCopy = [...tableDataWeightageCopy];
    tempCopy.forEach((data) => {
      if (data.instrumentCode == row.instrumentCode) {
        data.weightage = newValue.toString();
      }
    });
    setTableDataWeightageCopy(tempCopy);
  }

  return (
    <div className="flex gap-2 flex-col grow">
      <div className="mt-5 flex flex-col gap-2">
        {!isAdjustWeightageEnabled
          ? tableData.map((row) => {
              return (
                <div
                  key={row.instrumentCode}
                  className="flex p-3 m-1 border border-gray-500 hover:border-white transition-colors duration-200 rounded-lg"
                >
                  <div className="flex flex-col align-center justify-center grow">
                    <div className="text-sm w-full">{row?.instrumentName}</div>
                    <div className="flex gap-1 align-center w-full">
                      <Slider
                        maxValue={100}
                        minValue={0}
                        step={0.01}
                        isDisabled={true}
                        value={row.weightage}
                        className="w-4/5 self-center"
                        size="sm"
                        onChange={(newValue) => changeWeightage(newValue, row)}
                      />
                      <Input
                        labelPlacement="outside"
                        value={row.weightage}
                        onChange={(e: any) =>
                          changeWeightage(e.target.value, row)
                        }
                        isDisabled={true}
                        type="number"
                        className="w-1/5"
                        variant="underlined"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DeleteIcon
                      className="cursor-pointer text-red-500"
                      onClick={() => removeMututalFundFn(row)}
                    />
                  </div>
                </div>
              );
            })
          : tableDataWeightageCopy.map((row) => {
              return (
                <div
                  key={row.instrumentCode}
                  className="flex p-3 m-1 border border-gray-500 hover:border-red-500 transition-colors duration-200 rounded-lg"
                >
                  <div className="col-span-4 flex flex-col align-center justify-center grow">
                    <div className="text-sm w-full">{row?.instrumentName}</div>
                    <div className="flex gap-1 align-center w-full">
                      <Slider
                        maxValue={100}
                        minValue={0}
                        step={0.01}
                        isDisabled={!isAdjustWeightageEnabled}
                        value={row.weightage}
                        className="w-4/5 self-center"
                        size="sm"
                        onChange={(newValue) => changeWeightage(newValue, row)}
                      />
                      <Input
                        labelPlacement="outside"
                        value={row.weightage}
                        onChange={(e: any) =>
                          changeWeightage(e.target.value, row)
                        }
                        type="number"
                        className="w-1/5"
                        variant="underlined"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DeleteIcon
                      className="cursor-pointer text-red-500"
                      onClick={() => removeMututalFundFn(row)}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
