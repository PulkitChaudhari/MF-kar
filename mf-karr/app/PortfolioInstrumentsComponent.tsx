"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";

import { DeleteIcon } from "./icons";
import { columns } from "./constants";

import { Slider } from "@heroui/slider";
import { ValidationError } from "@react-types/shared";
import { usePortfolioContext } from "./contexts/PortfolioContext";

export default function PortfolioInstrumentsComponent({
  setIsLoading,
}: {
  setIsLoading: any;
}) {
  const {
    isAdjustWeightageEnabled,
    tableDataWeightageCopy,
    isSaveEnabled,
    setTableDataWeightageCopy,
    selectedInstrumentsData,
    selectedTimePeriod,
    removeMutualFund,
  } = usePortfolioContext();

  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    let tempTableData: any[] = [];
    Object.keys(selectedInstrumentsData).forEach((key: any) => {
      const instrumentInfo = selectedInstrumentsData[key];
      tempTableData.push({
        instrumentCode: key,
        instrumentName: instrumentInfo.instrumentName,
        cagr: instrumentInfo.cagr,
        weightage: instrumentInfo.weightage.toFixed(2),
      });
    });
    setTableData(tempTableData);
  }, [selectedInstrumentsData]);

  useEffect(() => {
    let toBeTableHeaders = [
      ...columns.map((column) => {
        return { ...column };
      }),
    ];
    toBeTableHeaders[1].label = Number(selectedTimePeriod) + "YR CAGR";
  }, [selectedTimePeriod]);

  useEffect(() => {
    isSaveEnabled(tableDataWeightageCopy);
  }, [tableDataWeightageCopy]);

  useEffect(() => {
    setTableDataWeightageCopy(tableData);
  }, [tableData]);

  function changeWeightage(newValue: number | number[], row: any) {
    const tempCopy = [...tableDataWeightageCopy];
    tempCopy.forEach((data) => {
      if (data.instrumentCode == row.instrumentCode) {
        data.weightage = newValue.toString();
      }
    });
    setTableDataWeightageCopy(tempCopy);
  }

  const handleRemoveMutualFund = async (item: any) => {
    setIsLoading(true);
    try {
      await removeMutualFund(item);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-col grow">
      <div className="mt-5 flex flex-col gap-2">
        {!isAdjustWeightageEnabled
          ? tableData.map((row) => {
              return (
                <div
                  key={row.instrumentCode}
                  className="flex p-3 m-1 border hover:border-gray-300 bg-stone-900 transition-colors duration-200 rounded-lg"
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
                      onClick={() => handleRemoveMutualFund(row)}
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
                      onClick={() => handleRemoveMutualFund(row)}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
