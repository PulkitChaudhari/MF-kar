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
import { partialMfData } from "./partialMfData";
import { IconSvgProps } from "@/types";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import PortfolioChart from "./portfolioChart";
import { mfData } from "./allMfData";

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

export const DeleteIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const SearchIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const yearOptions = [{ label: "1", value: 1 }];

  const [availableWeightage, setAvailableWeightage] = useState<number>(100);
  const [addedMutualFunds, setAddedMutualFunds] = useState<number>(0);

  const handleOpen = () => {
    onOpen();
  };

  const [data, setData] = useState<MFund[]>([]);

  const [allMfWeightedNAV, setAllMfWeightedNAV] = useState<any>();
  const [allNavData, setAllNavData] = useState<any>();

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

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
      console.log(data.weightage);
      if (data.schemeCode == schemeCode) {
        if (vBegin != -1 && vFinal != -1)
          data.cagr = ((Math.pow(vFinal / vBegin, 1 / 1) - 1.0) * 100).toFixed(
            2
          );
        else data.cagr = "-";
      }
      let unitsBought = data.weightage / tempAllNavData[data.schemeCode][0].nav;
      tempAllNavData[data.schemeCode].forEach((navData: any) => {
        // console.log(navData.nav);
        toBeAllMfWeightedNAV[data.schemeCode].push({
          date: navData.date,
          nav: unitsBought * navData.nav,
        });
        // console.log(navData.nav);
      });
      console.log(toBeAllMfWeightedNAV);
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
              console.log(schemeCode, navsForRange);
              let tempAllNavData: any = {
                [schemeCode]: navsForRange,
                ...allNavData,
              };
              console.log(tempAllNavData);
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
