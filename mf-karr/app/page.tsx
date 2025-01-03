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
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
} from "@nextui-org/react";
import MFund from "./interfaces";

import { ChartConfig } from "@/components/ui/chart";
import PortfolioChart from "./portfolioChart";
import { mfData } from "./allMfData";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";

const columns = [
  {
    key: "schemeName",
    label: "Scheme Name",
  },
  {
    key: "cagr",
    label: "1YR CAGR",
  },
  {
    key: "weightage",
    label: "Weightage",
  },
  { label: "Actions", key: "actions" },
];

const apiLinkPrefix: string = "https://api.mfapi.in/mf/";

export default function Home() {
  const { onOpen } = useDisclosure();

  const yearOptions = [{ label: "1", value: 1 }];

  const [availableWeightage, setAvailableWeightage] = useState<number>(100);
  const [addedMutualFunds, setAddedMutualFunds] = useState<number>(0);

  const handleOpen = () => {
    onOpen();
  };

  const [data, setData] = useState<MFund[]>([]);

  const [allMfWeightedNAV, setAllMfWeightedNAV] = useState<any>();
  const [allNavData, setAllNavData] = useState<any>();

  const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();
    return textValue.includes(inputValue);
  };

  function strToDate(dateStr: string) {
    const [day, month, year]: number[] = dateStr.split("-").map((str) => {
      return Number(str);
    });
    return new Date(year, month - 1, day);
  }

  function getNAVsForRange(navData: { date: Date; nav: string }[]): any[] {
    const resNavData: any[] = [];
    let thresholdDate = new Date();
    thresholdDate = new Date(
      thresholdDate.getFullYear() - 1,
      thresholdDate.getMonth(),
      thresholdDate.getDate()
    );
    for (let idx = 0; idx < navData.length; idx++) {
      if (navData[idx].date <= thresholdDate) break;
      resNavData.push({
        date: navData[idx].date,
        nav: Number(navData[idx].nav),
      });
    }
    resNavData.reverse();
    return resNavData;
  }

  function updateWeightage(
    finalData: any[],
    schemeCode: string,
    vBegin: number,
    vFinal: number,
    tempAllNavData: any[]
  ) {
    let toBeAllMfWeightedNAV: any = {};
    finalData.forEach((data: any) => {
      toBeAllMfWeightedNAV[data.schemeCode] = [];
      data.weightage = Number(
        (availableWeightage / (addedMutualFunds + 1)).toFixed(2)
      );
      if (data.schemeCode == schemeCode) {
        if (vBegin != -1 && vFinal != -1)
          data.cagr = ((Math.pow(vFinal / vBegin, 1 / 1) - 1.0) * 100).toFixed(
            2
          );
        else data.cagr = "-";
      }
      let unitsBought = data.weightage / tempAllNavData[data.schemeCode][0].nav;
      tempAllNavData[data.schemeCode].forEach((navData: any) => {
        toBeAllMfWeightedNAV[data.schemeCode].push({
          date: navData.date,
          nav: unitsBought * navData.nav,
        });
      });
    });
    return toBeAllMfWeightedNAV;
  }

  const addMFToTable = async (schemeCode: any) => {
    if (schemeCode !== null) {
      const filteredData = mfData.filter(
        (mf) => mf.schemeCode.toString() === schemeCode
      );
      fetch(apiLinkPrefix + schemeCode).then((resp) => {
        resp
          .json()
          .then(
            (apiData: {
              meta: any;
              data: { date: string; nav: string }[];
              status: string;
            }) => {
              // Converting date as string to Date type
              const navData: { date: Date; nav: string }[] = apiData.data.map(
                (data) => {
                  return {
                    date: strToDate(data.date),
                    nav: data.nav,
                  };
                }
              );
              // Getting NAVs for newly added MF in the span of threshold
              const navsForRange = getNAVsForRange(navData);
              // Adding newly added scheme to existing schemes
              const finalData = [...data, ...filteredData];
              // Getting Latest and Historical NAV value
              const [vBegin, vFinal] = [
                navsForRange.length > 0 ? navsForRange[0].nav : -1,
                navsForRange.length > 0
                  ? navsForRange[navsForRange.length - 1].nav
                  : -1,
              ];
              let tempAllNavData: any = {
                [schemeCode]: navsForRange,
                ...allNavData,
              };
              const toBeAllMfWeightedNAV = updateWeightage(
                finalData,
                schemeCode,
                vBegin,
                vFinal,
                tempAllNavData
              );
              setAllNavData(tempAllNavData);
              setAddedMutualFunds(addedMutualFunds + 1);
              setAllMfWeightedNAV(toBeAllMfWeightedNAV);
              setData(finalData);
            }
          );
      });
    }
  };

  const removeMutualFund = (item: any) => {
    const tempData = data.filter((indiData) => {
      return indiData.schemeCode != item.schemeCode;
    });
    setData(tempData);
  };

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2">
        <Autocomplete
          defaultItems={mfData}
          label="Favorite Animal"
          listboxProps={{
            emptyContent: "Your own empty content text.",
          }}
          menuTrigger="input"
          placeholder="Search an animal"
          onSelectionChange={($event) => addMFToTable($event)}
          defaultFilter={myFilter}
          className="w-3/4"
        >
          {(item) => (
            <AutocompleteItem key={item.schemeCode}>
              {item.schemeName}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          defaultItems={yearOptions}
          label="Favorite Animal"
          listboxProps={{
            emptyContent: "Your own empty content text.",
          }}
          menuTrigger="input"
          placeholder="Search an animal"
          onSelectionChange={($event) => addMFToTable($event)}
          className="w-1/4"
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.schemeCode}>
              {(columnKey) => {
                if (columnKey == "actions") {
                  return (
                    <TableCell>
                      <Tooltip color="danger" content="Remove Mutual Fund">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <DeleteIcon onClick={() => removeMutualFund(item)} />
                        </span>
                      </Tooltip>
                    </TableCell>
                  );
                } else if (columnKey == "weightage") {
                  return (
                    <TableCell className="flex gap-2">
                      {getKeyValue(item, columnKey)}
                      <Tooltip content="Edit Weightage">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <EditIcon />
                        </span>
                      </Tooltip>
                    </TableCell>
                  );
                } else
                  return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mx-10 my-10">
        <PortfolioChart chartData={allMfWeightedNAV} />
      </div>
    </div>
  );
}
