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
  Chip,
} from "@nextui-org/react";

import { DeleteIcon } from "./DeleteIcon";
import { columns } from "./constants";

import { Slider } from "@heroui/slider";

export default function PortfolioTable({
  selectedNavData,
  removeMututalFundFn,
  timePeriod,
}: {
  selectedNavData: any[];
  removeMututalFundFn: any;
  timePeriod: Number;
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
            {tableData.map((row) => (
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
                      // <TableCell
                      //   width={row.width}
                      //   className="flex justify-center h-full"
                      // >
                      //   {getKeyValue(row, columnKey)}
                      //   <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      //     {/* <EditIcon /> */}
                      //   </span>
                      // </TableCell>
                      <TableCell>
                        <Slider
                          className="max-w-md"
                          defaultValue={Number(getKeyValue(row, columnKey))}
                          maxValue={100}
                          minValue={0}
                          step={0.01}
                          isDisabled={true}
                        />
                        {getKeyValue(row, columnKey)}
                      </TableCell>
                    );
                  } else
                    return <TableCell>{getKeyValue(row, columnKey)}</TableCell>;
                }}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
