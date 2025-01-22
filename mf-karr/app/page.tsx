"use client";
import React, { Key, useState } from "react";
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
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { ChartConfig } from "@/components/ui/chart";
import PortfolioChart from "./portfolioChart";
import { mfData } from "./allMfData";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import PortfolioTable from "./portfolioTable";
import { apiResponse, navData, tableColumn } from "./interfaces/interfaces";
import { cagrValues } from "./constants";
import { Label } from "@/components/ui/label";
import { CancelIcon } from "./CancelIcon";
import { SaveIcon } from "./SaveIcon";
import { MyServiceClient } from "../generated/ServiceServiceClientPb";
import { RequestMessage } from "../generated/service_pb";

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

const client = new MyServiceClient("http://localhost:8081", null, {
  withCredentials: false,
  // Debug mode to see what's happening with the requests
  debug: true,
});

export default function Home() {
  const { onOpen } = useDisclosure();

  const yearOptions = [{ label: "1", value: 1 }];

  const [availableWeightage, setAvailableWeightage] = useState<number>(100);
  const [addedMutualFunds, setAddedMutualFunds] = useState<number>(0);
  const [isEditingWeight, setIsEditingWeight] = useState<boolean>(false);
  const [ogNAVData, setOgNAVData] = useState<{
    [schemeCode: string]: { nav: number; date: Date }[];
  }>({});

  const handleOpen = () => {
    onOpen();
  };

  const [tableData, setTableData] = useState<any[]>([]);

  const [allMfWeightedNAV, setAllMfWeightedNAV] = useState<{
    [schemeCode: string]: [{ nav: number; date: Date }];
  }>({});
  const [allNavData, setAllNavData] = useState<any>();
  const [selectedCAGR, setSelectedCAGR] = useState<String>("1");

  const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();
    return textValue.includes(inputValue);
  };

  function strToDate(dateStr: string): Date {
    const [day, month, year]: number[] = dateStr.split("-").map((str) => {
      return Number(str);
    });
    return new Date(year, month - 1, day);
  }

  function tempFunc() {
    const request = new RequestMessage();
    request.setQuery("World");

    console.log("Sending request to server...");

    client.getData(request, {}, (err, response) => {
      if (err) {
        console.error("Error details:", {
          code: err.code,
          message: err.message,
          metadata: err.metadata,
        });
        return;
      }
      console.log("Response received:", response.getResult());
    });
  }

  function getNAVsForRange(navData: navData[]): any[] {
    const resNavData: any[] = [];
    let thresholdDate = new Date();
    thresholdDate = new Date(
      thresholdDate.getFullYear() - Number(selectedCAGR),
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
    tempAllNavData: any,
    operator: number
  ) {
    let toBeAllMfWeightedNAV: any = {};
    finalData.forEach((data: any) => {
      toBeAllMfWeightedNAV[data.schemeCode] = {};
      toBeAllMfWeightedNAV[data.schemeCode].data = [];
      data.weightage = Number(
        (availableWeightage / (addedMutualFunds + operator)).toFixed(2)
      );
      toBeAllMfWeightedNAV[data.schemeCode].weightage = data.weightage;
      let unitsBought =
        tempAllNavData[data.schemeCode].data.length > 0
          ? data.weightage / tempAllNavData[data.schemeCode].data[0].nav
          : 0;
      tempAllNavData[data.schemeCode].data.forEach((navData: any) => {
        toBeAllMfWeightedNAV[data.schemeCode].data.push({
          date: navData.date,
          nav: unitsBought * navData.nav,
        });
      });
    });
    return toBeAllMfWeightedNAV;
  }

  function calculateCAGR(navsForRange: any[]) {
    let vFinal = -1,
      vBegin = -1;

    if (navsForRange.length > 0) {
      vBegin = navsForRange[0].nav;
      vFinal = navsForRange[navsForRange.length - 1].nav;
    }
    return (
      (Math.pow(vFinal / vBegin, 1 / Number(selectedCAGR)) - 1) *
      100
    ).toFixed(2);
  }

  function convertNavDateFromStrToDate(apiData: apiResponse): navData[] {
    let convertedData: navData[] = [];
    apiData.data.map((data) => {
      convertedData.push({
        date: strToDate(data.date),
        nav: data.nav,
      });
    });
    return convertedData;
  }

  function addMFToTable(
    schemeCode: any,
    previousData: any = allNavData,
    previousOgNavData: any = ogNAVData
  ) {
    // Check if schemeCode is not null
    if (schemeCode !== null) {
      fetch(apiLinkPrefix + schemeCode).then((resp) => {
        resp.json().then((apiData: apiResponse) => {
          // Converting date's string type to Date type
          const navData: navData[] = convertNavDateFromStrToDate(apiData);

          // Getting NAVs for newly added MF in the span of threshold
          const navsForRange = getNAVsForRange(navData);
          console.log(navsForRange);

          // Adding to OgNAVData
          setOgNAVData({ ...previousOgNavData, schemeCode: navsForRange });

          // Adding newly added scheme to schemes
          let filteredData = mfData.filter(
            (mf) => mf.schemeCode.toString() === schemeCode
          );

          // Calculating CAGR for newMF
          filteredData[0].cagr = calculateCAGR(navsForRange);

          const finalTableData = [...tableData, ...filteredData];

          // Getting Latest and Historical NAV value
          const [vBegin, vFinal] = [
            navsForRange.length > 0 ? navsForRange[0].nav : -1,
            navsForRange.length > 0
              ? navsForRange[navsForRange.length - 1].nav
              : -1,
          ];
          let tempAllNavData: any = {
            [schemeCode]: { data: navsForRange, weightage: 0 },
            ...previousData,
          };
          const toBeAllMfWeightedNAV = updateWeightage(
            finalTableData,
            tempAllNavData,
            +1
          );
          console.log("tobeallmfweightednav", toBeAllMfWeightedNAV);
          console.log("finalTableData", finalTableData);
          console.log("tempAllnavData", tempAllNavData);
          setAddedMutualFunds(addedMutualFunds + 1);
          setAllMfWeightedNAV(toBeAllMfWeightedNAV);
          setTableData(finalTableData);
          setAllNavData(tempAllNavData);
        });
      });
    }
  }

  const removeMutualFund = (item: any) => {
    // Removing scheme from the table
    const tempData = tableData.filter((indiData) => {
      return indiData.schemeCode != item.schemeCode;
    });
    let tempMap: { [schemeCode: string]: [{ nav: number; date: Date }] } = {};
    Object.keys(allMfWeightedNAV).forEach((key) => {
      if (Number(key) !== item.schemeCode) {
        tempMap[key] = allMfWeightedNAV[key];
      }
    });
    let toBeAllMfWeightedNAV = updateWeightage(tempData, tempMap, -1);
    setAllMfWeightedNAV(toBeAllMfWeightedNAV);
    setTableData(tempData);
    setAddedMutualFunds(addedMutualFunds - 1);
  };

  function changeTimePeriod(timePeriod: any) {
    setSelectedCAGR(timePeriod.toString());
    let tempAllMfWeightedNAV: any = {};
    console.log(allNavData);
    Object.keys(allNavData).forEach((key) => {
      console.log(key);
      addMFToTable(key, {});
      // tempAllMfWeightedNAV[key] = {};
      // tempAllMfWeightedNAV[key].data = getNAVsForRange(allNavData[key].data);
      // tempAllMfWeightedNAV[key].weightage = allNavData[key].weightage;
    });
    setAllMfWeightedNAV(tempAllMfWeightedNAV);
  }

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-3 flex-col items-center justify-between lg:flex-row">
        <Button
          isIconOnly
          aria-label="Like"
          color="success"
          onPress={() => tempFunc()}
        />
        <Autocomplete
          defaultItems={mfData}
          label="Select Scheme"
          listboxProps={{
            emptyContent: "Your own empty content text.",
          }}
          menuTrigger="input"
          onSelectionChange={($event) => addMFToTable($event)}
          defaultFilter={myFilter}
          className="w-full lg:w-9/12"
        >
          {(item) => (
            <AutocompleteItem key={item.schemeCode}>
              {item.schemeName}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <div className="flex gap-2">
          <Dropdown id="line-graph" className="w-1/12 lg:w-full">
            <DropdownTrigger>
              <Button variant="bordered">Time period: {selectedCAGR}Y</Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(timePeriod) => changeTimePeriod(timePeriod)}
              aria-label="Dynamic Actions"
              items={cagrValues}
            >
              {(item) => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          {isEditingWeight ? (
            <div className="flex gap-3">
              <Button
                isIconOnly
                aria-label="Like"
                color="success"
                onPress={() => setIsEditingWeight(false)}
              >
                <SaveIcon />
              </Button>
              <Button
                isIconOnly
                aria-label="Like1"
                color="danger"
                onPress={() => setIsEditingWeight(false)}
              >
                <CancelIcon />
              </Button>
            </div>
          ) : (
            <Button
              isDisabled={true}
              variant="bordered"
              onPress={() => setIsEditingWeight(true)}
            >
              Adjust Weightage
            </Button>
          )}
        </div>
      </div>
      <PortfolioTable
        tableData={tableData}
        removeMututalFundFn={removeMutualFund}
      />
      <div className="">
        <PortfolioChart
          chartData={allMfWeightedNAV}
          selectedCAGR={Number(selectedCAGR)}
        />
      </div>
    </div>
  );
}
