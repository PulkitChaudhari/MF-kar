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
} from "@nextui-org/react";

import { DeleteIcon } from "./DeleteIcon";
import { columns } from "./constants";

import { Slider } from "@heroui/slider";
import { ValidationError } from "@react-types/shared";

export default function PortfolioTable({
  selectedNavData,
  removeMututalFundFn,
  timePeriod,
  isAdjustWeightageEnabled,
  isSaveEnabled,
  tableDataWeightageCopy,
  setTableDataWeightageCopy,
}: {
  selectedNavData: any[];
  removeMututalFundFn: any;
  timePeriod: Number;
  isAdjustWeightageEnabled: boolean;
  isSaveEnabled: any;
  tableDataWeightageCopy: any[];
  setTableDataWeightageCopy: any;
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
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={tableHeaders}>
            {(column) => {
              return (
                <TableColumn
                  align="center"
                  width={column.width}
                  key={column.key}
                >
                  {column.label}
                </TableColumn>
              );
            }}
          </TableHeader>
          <TableBody>
            {isAdjustWeightageEnabled
              ? tableDataWeightageCopy.map((row) => (
                  <TableRow key={row.instrumentCode}>
                    {(columnKey) => {
                      if (columnKey == "actions") {
                        return (
                          <TableCell>
                            <span className="flex justify-center h-full text-lg text-danger cursor-pointer active:opacity-50">
                              <DeleteIcon
                                onClick={() => removeMututalFundFn(row)}
                              />
                            </span>
                          </TableCell>
                        );
                      } else if (columnKey == "weightage") {
                        return (
                          <TableCell className="flex gap-1 justify-center">
                            <Slider
                              maxValue={100}
                              minValue={0}
                              step={0.01}
                              isDisabled={!isAdjustWeightageEnabled}
                              className="w-3/5 self-center"
                              value={Number(getKeyValue(row, columnKey))}
                              onChange={(newValue) =>
                                changeWeightage(newValue, row)
                              }
                            />
                            <Input
                              labelPlacement="outside"
                              value={getKeyValue(row, columnKey)}
                              onChange={(e: any) =>
                                changeWeightage(e.target.value, row)
                              }
                              type="number"
                              variant="underlined"
                              className="w-2/5"
                            />
                          </TableCell>
                        );
                      } else
                        return (
                          <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                        );
                    }}
                  </TableRow>
                ))
              : tableData.map((row) => (
                  <TableRow key={row.instrumentCode}>
                    {(columnKey) => {
                      if (columnKey == "actions") {
                        return (
                          <TableCell>
                            <span className="flex justify-center h-full text-lg text-danger cursor-pointer active:opacity-50">
                              <DeleteIcon
                                onClick={() => removeMututalFundFn(row)}
                              />
                            </span>
                          </TableCell>
                        );
                      } else if (columnKey == "weightage") {
                        return (
                          <TableCell className="flex gap-1 justify-center">
                            <Slider
                              maxValue={100}
                              minValue={0}
                              step={0.01}
                              isDisabled={!isAdjustWeightageEnabled}
                              className="w-3/5 self-center"
                              value={Number(getKeyValue(row, columnKey))}
                              onChange={(newValue) =>
                                changeWeightage(newValue, row)
                              }
                            />
                            <Input
                              labelPlacement="outside"
                              value={getKeyValue(row, columnKey)}
                              onChange={(e: any) =>
                                changeWeightage(e.target.value, row)
                              }
                              type="text"
                              variant="underlined"
                              className="w-2/5"
                              isDisabled={true}
                            />
                          </TableCell>
                        );
                      } else
                        return (
                          <TableCell>{getKeyValue(row, columnKey)}</TableCell>
                        );
                    }}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
