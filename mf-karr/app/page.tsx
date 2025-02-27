"use client";
import React, { useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Card,
  Tabs,
  Tab,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { GiInjustice } from "react-icons/gi";
import { TfiSave } from "react-icons/tfi";
import { RxCross2 } from "react-icons/rx";
import PortfolioChart from "./portfolioChart";
import PortfolioTable from "./portfolioTable";
import { apiResponse } from "./interfaces/interfaces";
import { cagrValues } from "./constants";
import { config } from "../config/config";
import { useSession, signIn } from "next-auth/react";
import { FaCheck } from "react-icons/fa6";

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

const apiLinkPrefix: string = "http://localhost:8081/api/instrument";

export default function Home() {
  const [isAdjustWeightageEnabled, setIsAdjustWeightageEnabled] =
    useState<boolean>(false);
  const [toBeData, setToBeData] = useState<any[]>([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<String>("1");
  const [tableDataWeightageCopy, setTableDataWeightageCopy] = useState<any[]>(
    []
  );
  const [selectedInstrumentsData, setSelectedInstrumentsData] = useState<any>(
    []
  );
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] =
    useState<boolean>(false);
  const [isShowTable, setIsShowTable] = useState<Boolean>(true);
  const { data: session } = useSession();
  const [showSavePortfolioNameModal, setShowSavePortfolioNameModal] =
    useState<boolean>(false);
  const [portfolioName, setPortfolioName] = useState("");

  function getNAVsForRange(apiData: any, timePeriod: Number): any[] {
    let convertedData: any[] = [];

    for (let idx = apiData.length - 1; idx >= 0; idx--) {
      const nav = Number(apiData[idx][1]);
      const date = new Date(Date.parse(apiData[idx][0]));
      // if (date <= thresholdDate) break;
      convertedData.push({
        date: date,
        nav: nav,
      });
    }

    convertedData.reverse();
    return convertedData;
  }

  function updateWeight(tempInstrumentData: any) {
    const instrumentCodes = Object.keys(tempInstrumentData);
    instrumentCodes.forEach((code) => {
      tempInstrumentData[code].weightage = Math.floor(
        100 / instrumentCodes.length
      );
    });
    if (100 % instrumentCodes.length != 0 && instrumentCodes.length > 0) {
      const code = instrumentCodes[0];
      tempInstrumentData[code].weightage = Math.ceil(
        100 / instrumentCodes.length
      );
    }
    return tempInstrumentData;
  }

  function calculateCAGR(navsForRange: any[], timePeriod: Number) {
    let vFinal = -1,
      vBegin = -1;

    if (navsForRange.length > 0) {
      vBegin = navsForRange[0].nav;
      vFinal = navsForRange[navsForRange.length - 1].nav;
    }
    return (
      (Math.pow(vFinal / vBegin, 1 / Number(timePeriod)) - 1) *
      100
    ).toFixed(2);
  }

  async function fetchInstrumentData(
    schemeCode: any,
    timePeriod: any
  ): Promise<apiResponse> {
    return await fetch(config.apiUrl + `/api/instrument`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instrumentCode: schemeCode,
        timePeriod: timePeriod,
      }),
    }).then(async (resp) => {
      return await resp.json().then((apiData: apiResponse) => {
        return apiData;
      });
    });
  }

  async function generateInstrumentData(
    instrumentCode: number,
    timePeriod: String
  ) {
    return await fetchInstrumentData(instrumentCode, timePeriod).then(
      (apiData: any) => {
        const navsForRange = getNAVsForRange(
          apiData[instrumentCode].instrumentData,
          Number(timePeriod)
        );

        const instrumentObj: any = {
          instrumentName: apiData[instrumentCode].instrumentName,
          cagr: calculateCAGR(navsForRange, Number(timePeriod)),
          weightage: "",
          navData: navsForRange,
        };

        return instrumentObj;
      }
    );
  }

  function addInstrument(instrumentValue: any) {
    if (instrumentValue !== null) {
      generateInstrumentData(instrumentValue, selectedTimePeriod).then(
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

  async function changeTimePeriod(timePeriod: any) {
    let tempSelectedInstrumentsData: any = {};
    const instrumentCodes = Object.keys(selectedInstrumentsData);

    // Collect all promises
    const promises = instrumentCodes.map(async (key) => {
      const newInstrumentData = await generateInstrumentData(
        Number(key),
        timePeriod
      );
      tempSelectedInstrumentsData = {
        ...tempSelectedInstrumentsData,
        [key]: newInstrumentData,
      };
    });
    await Promise.all(promises);
    tempSelectedInstrumentsData = updateWeight(tempSelectedInstrumentsData);

    setSelectedInstrumentsData(tempSelectedInstrumentsData);
    setSelectedTimePeriod(timePeriod.toString());
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
      json = json.filter((scheme) => {
        const keysArr = Object.keys(selectedInstrumentsData);
        if (keysArr.length > 0)
          return !keysArr.includes(scheme.instrumentCode.toString());
        return true;
      });
      return { items: json };
    },
  });

  function isSaveEnabled(posSelectedInstrumentsData: any[]): void {
    let totalWeightage = 0;
    posSelectedInstrumentsData.forEach((data: any) => {
      totalWeightage += Number(data.weightage);
    });
    if (totalWeightage == 100) setIsSaveButtonEnabled(true);
    else setIsSaveButtonEnabled(false);
    setToBeData(posSelectedInstrumentsData);
  }

  function onSave() {
    let keysArr = Object.keys(selectedInstrumentsData);
    let tempData = { ...selectedInstrumentsData };
    toBeData.forEach((data: any) => {
      if (keysArr.includes(data.instrumentCode)) {
        tempData[data.instrumentCode].weightage = Number(data.weightage);
      }
    });
    setSelectedInstrumentsData(tempData);
    setIsAdjustWeightageEnabled(false);
  }

  function onCancelWeightAdjust() {
    setSelectedInstrumentsData({ ...selectedInstrumentsData });
    setIsAdjustWeightageEnabled(false);
  }

  function savePortfolio() {
    const toBeSentData: any[] = [];
    Object.keys(selectedInstrumentsData).forEach((key) => {
      const weightage = selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });
    fetch(config.apiUrl + `/api/portfolio/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId: session?.user?.email,
        instrumentsData: toBeSentData,
        portfolioName: portfolioName,
      }),
    }).then(async (resp) => {
      console.log(resp);
    });
    console.log("Portfolio saved");
    setShowSavePortfolioNameModal(false);
  }

  return (
    <div>
      {!session ? (
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={true}
          hideCloseButton={true}
          className="p-2"
        >
          <ModalContent>
            <ModalBody>
              <Button
                isIconOnly
                variant="bordered"
                onPress={() => signIn("github")}
                className="w-full p-2"
              >
                Sign In Github
              </Button>
              <Button
                isIconOnly
                variant="bordered"
                onPress={() => signIn("google")}
                className="w-full p-2"
              >
                Sign In Google
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <div>
          <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={showSavePortfolioNameModal}
            hideCloseButton={true}
            className="p-2"
          >
            <ModalContent>
              <Input
                label="Portfolio Name"
                type="text"
                value={portfolioName}
                onValueChange={setPortfolioName}
              />
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button
                  isIconOnly
                  variant="bordered"
                  className="w-full hover:bg-green-200 transition-all"
                  onPress={() => savePortfolio()}
                >
                  <FaCheck />
                </Button>
                <Button
                  isIconOnly
                  variant="bordered"
                  className="w-full hover:bg-red-200 transition-all"
                  onPress={() => setShowSavePortfolioNameModal(false)}
                >
                  <RxCross2 />
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <div className="w-full gap-2 grid grid-cols-3 grid-rows-1 px-1 max-h-[80vh]">
            <Card className="col-span-1 sm:col-span-1 gap-2 grid-rows-2 p-3 overflow-y-auto">
              <div className="flex gap-2 w-full">
                <Dropdown isDisabled={isAdjustWeightageEnabled} id="line-graph">
                  <DropdownTrigger>
                    <Button variant="bordered">{selectedTimePeriod}Y</Button>
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
                {isAdjustWeightageEnabled ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      isIconOnly
                      aria-label="Like"
                      color="success"
                      className="w-1/2"
                      isDisabled={!isSaveButtonEnabled}
                      onPress={() => onSave()}
                    >
                      <FaCheck />
                    </Button>
                    <Button
                      isIconOnly
                      aria-label="Like1"
                      color="danger"
                      onPress={() => onCancelWeightAdjust()}
                      className="w-1/2"
                    >
                      <RxCross2 />
                    </Button>
                  </div>
                ) : (
                  <Button
                    isIconOnly
                    variant="bordered"
                    onPress={() => setIsAdjustWeightageEnabled(true)}
                    className="w-full"
                  >
                    <GiInjustice />
                  </Button>
                )}
                <Button
                  isIconOnly
                  variant="bordered"
                  className="w-full"
                  onPress={() => setShowSavePortfolioNameModal(true)}
                >
                  <TfiSave />
                </Button>
                {/* <Tabs isDisabled={true} aria-label="Options" className="w-full">
            <Tab key="photos" title="One-Time"></Tab>
            <Tab key="music" title="SIP"></Tab>
          </Tabs> */}
              </div>
              <PortfolioTable
                selectedNavData={selectedInstrumentsData}
                removeMututalFundFn={removeMutualFund}
                timePeriod={Number(selectedTimePeriod)}
                isAdjustWeightageEnabled={isAdjustWeightageEnabled}
                isSaveEnabled={isSaveEnabled}
                tableDataWeightageCopy={tableDataWeightageCopy}
                setTableDataWeightageCopy={setTableDataWeightageCopy}
              />
            </Card>
            <Card className="col-span-2 sm:col-span-2 h-full gap-2 grid-rows-2 p-3 overflow-y-auto">
              <div className="flex flex-col gap-3">
                <Autocomplete
                  inputValue={list.filterText}
                  isLoading={list.isLoading}
                  items={list.items}
                  label="Select an instrument"
                  onInputChange={list.setFilterText}
                  onSelectionChange={($event) => addInstrument($event)}
                  menuTrigger="input"
                  className="w-full"
                  listboxProps={{
                    emptyContent: "No results found",
                  }}
                  isDisabled={isAdjustWeightageEnabled}
                >
                  {(item: any) => (
                    <AutocompleteItem
                      key={item.instrumentCode}
                      className="capitalize"
                    >
                      {item.instrumentName}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <PortfolioChart
                  instrumentsData={selectedInstrumentsData}
                  timePeriod={Number(selectedTimePeriod)}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
