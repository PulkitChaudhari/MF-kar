"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import PortfolioChart from "./portfolioChart";
import { mfData } from "./allMfData";
import PortfolioTable from "./portfolioTable";
import { apiResponse, navData, tableColumn } from "./interfaces/interfaces";
import { cagrValues } from "./constants";
import { CancelIcon } from "./CancelIcon";
import { SaveIcon } from "./SaveIcon";
import { config } from "../config/config";

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

const apiLinkPrefix: string = "http://localhost:8081/api/instrument/";

export default function Home() {
  const [availableWeightage, setAvailableWeightage] = useState<number>(100);
  const [addedMutualFunds, setAddedMutualFunds] = useState<number>(0);
  const [isEditingWeight, setIsEditingWeight] = useState<boolean>(false);
  const [ogNAVData, setOgNAVData] = useState<{
    [schemeCode: string]: { nav: number; date: Date }[];
  }>({});

  const [tableData, setTableData] = useState<any[]>([]);

  const [allMfWeightedNAV, setAllMfWeightedNAV] = useState<{
    [schemeCode: string]: [{ nav: number; date: Date }];
  }>({});
  const [allNavData, setAllNavData] = useState<any>();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<String>("1");

  const [selectedInstrumentsData, setSelectedInstrumentsData] = useState<any>(
    []
  );

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

  function getNAVsForRange(apiData: any, timePeriod: Number): any[] {
    let convertedData: any[] = [];

    let thresholdDate = new Date();
    thresholdDate = new Date(
      thresholdDate.getFullYear() - Number(timePeriod),
      thresholdDate.getMonth(),
      thresholdDate.getDate()
    );

    for (let idx = 0; idx < apiData.length; idx++) {
      const nav = Number(apiData[idx].nav);
      const date = strToDate(apiData[idx].date);
      if (date <= thresholdDate) break;
      convertedData.push({
        date: date,
        nav: nav,
      });
    }

    convertedData.reverse();
    return convertedData;
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

  function updateWeight(tempInstrumentData: any) {
    const instrumentCodes = Object.keys(tempInstrumentData);
    instrumentCodes.forEach((code) => {
      tempInstrumentData[code].weightage = 100 / instrumentCodes.length;
    });
    return tempInstrumentData;
  }

  function calculateCAGR(navsForRange: any[]) {
    let vFinal = -1,
      vBegin = -1;

    if (navsForRange.length > 0) {
      vBegin = navsForRange[0].nav;
      vFinal = navsForRange[navsForRange.length - 1].nav;
    }
    return (
      (Math.pow(vFinal / vBegin, 1 / Number(selectedTimePeriod)) - 1) *
      100
    ).toFixed(2);
  }

  async function fetchInstrumentData(schemeCode: any): Promise<apiResponse> {
    return await fetch(apiLinkPrefix + schemeCode).then(async (resp) => {
      return await resp.json().then((apiData: apiResponse) => {
        return apiData;
      });
    });
  }

  async function generateInstrumentData(
    instrumentCode: number,
    timePeriod: String = selectedTimePeriod
  ) {
    return await fetchInstrumentData(instrumentCode).then((apiData: any) => {
      const navsForRange = getNAVsForRange(
        apiData[instrumentCode].instrumentData,
        Number(timePeriod)
      );

      const instrumentObj: any = {
        instrumentName: apiData[instrumentCode].instrumentName,
        cagr: calculateCAGR(navsForRange),
        weightage: "",
        navData: navsForRange,
      };

      return instrumentObj;
    });
  }

  function addInstrument(instrumentValue: any) {
    if (instrumentValue !== null) {
      generateInstrumentData(instrumentValue, "1").then(
        (instrumentData: any) => {
          let tempInstrumentData = {
            ...selectedInstrumentsData,
            [instrumentValue]: instrumentData,
          };
          tempInstrumentData = updateWeight(tempInstrumentData);
          setSelectedInstrumentsData(tempInstrumentData);
        }
      );
    }
  }

  const removeMutualFund = (item: any) => {
    // Removing scheme from the table
    let tempData = { ...selectedInstrumentsData };
    delete tempData[item.instrumentCode];
    tempData = updateWeight(tempData);
    setSelectedInstrumentsData(tempData);
  };

  function changeTimePeriod(timePeriod: any) {
    setSelectedTimePeriod(timePeriod.toString());
    let tempAllMfWeightedNAV: any = {};
    Object.keys(allNavData).forEach((key) => {
      // generateInstrumentData(key);
    });
    setAllMfWeightedNAV(tempAllMfWeightedNAV);
  }

  const list: any = useAsyncList({
    async load({ signal, filterText }) {
      if (filterText === "") {
        return {
          items: [],
        };
      }
      let res = await fetch(config.apiUrl + `/api/instruments/${filterText}`, {
        signal,
      });
      let json: any[] = await res.json();
      // json = json.filter((scheme) => {
      //   const keysArr = Object.keys(ogNAVData);
      //   if (keysArr.length > 0)
      //     return !keysArr.includes(scheme.instrumentCode.toString());
      //   return true;
      // });
      return { items: json };
    },
  });

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-3 flex-col items-center justify-between lg:flex-row">
        <Autocomplete
          inputValue={list.filterText}
          isLoading={list.isLoading}
          items={list.items}
          label="Select an instrument"
          onInputChange={list.setFilterText}
          onSelectionChange={($event) => addInstrument($event)}
          menuTrigger="input"
          className="w-full lg:w-9/12"
          listboxProps={{
            emptyContent: "No results found",
          }}
        >
          {(item: any) => (
            <AutocompleteItem key={item.instrumentCode} className="capitalize">
              {item.instrumentName}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <div className="flex gap-2">
          <Dropdown id="line-graph" className="w-1/12 lg:w-full">
            <DropdownTrigger>
              <Button isDisabled={true} variant="bordered">
                Time period: {selectedTimePeriod}Y
              </Button>
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
        selectedNavData={selectedInstrumentsData}
        removeMututalFundFn={removeMutualFund}
      />
      <div className="">
        <PortfolioChart
          selectedInstrumentsData={selectedInstrumentsData}
          selectedCAGR={Number(selectedTimePeriod)}
        />
      </div>
    </div>
  );
}
