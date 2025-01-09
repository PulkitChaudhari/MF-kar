"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Tooltip,
} from "@nextui-org/react";

import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { tableRow } from "./interfaces/interfaces";
import { columns } from "./constants";

export default function PortfolioTable({
  tableData,
  removeMututalFundFn,
}: {
  tableData: tableRow[];
  removeMututalFundFn: any;
}) {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.schemeCode}>
                {(columnKey) => {
                  if (columnKey == "actions") {
                    return (
                      <TableCell>
                        <Tooltip color="danger" content="Remove Mutual Fund">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <DeleteIcon
                              onClick={() => removeMututalFundFn(row)}
                            />
                          </span>
                        </Tooltip>
                      </TableCell>
                    );
                  } else if (columnKey == "weightage") {
                    return (
                      <TableCell className="flex gap-2">
                        {getKeyValue(row, columnKey)}
                        <Tooltip content="Edit Weightage">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon />
                          </span>
                        </Tooltip>
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
