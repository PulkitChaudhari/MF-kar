"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Input,
  Form,
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
import { CiExport } from "react-icons/ci";

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
  const [showSavePortfolioNameModal, setShowSavePortfolioNameModal] =
    useState<boolean>(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [errors, setErrors] = useState({});
  const [showSavedPortolioModal, setShowSavedPortolioModal] =
    useState<boolean>(false);
  const [userSavedPortfolios, setUserSavedPortfolios] = useState<any[]>([]);
  const { data: session } = useSession();
  const [initialAmount, setInitialAmount] = useState<string>("100000");

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

  async function addInstrument(instrumentValue: any) {
    if (instrumentValue !== null) {
      const instrumentData = await generateInstrumentData(
        instrumentValue,
        selectedTimePeriod
      );
      let tempInstrumentData = await {
        ...selectedInstrumentsData,
        [instrumentValue]: instrumentData,
      };
      tempInstrumentData = updateWeight(tempInstrumentData);
      setSelectedInstrumentsData(tempInstrumentData);
      return tempInstrumentData;
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

  function onSave(
    toBeDataWeightage: any = toBeData,
    instrumentsData: any = selectedInstrumentsData
  ) {
    let keysArr = Object.keys(instrumentsData);
    let tempData = { ...instrumentsData };
    toBeDataWeightage.forEach((data: any) => {
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

  async function savePortfolio(data: any) {
    const toBeSentData: any[] = [];
    Object.keys(selectedInstrumentsData).forEach((key) => {
      const weightage = selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });
    return fetch(config.apiUrl + `/api/portfolio/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId: session?.user?.email,
        instrumentsData: toBeSentData,
        portfolioName: data.portfolioName,
      }),
    });
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = savePortfolio(data).then((resp) => {
      resp.json().then((res) => {
        if (res == "Duplicate Portfolio name")
          setShowSavePortfolioNameModal(false);
        else setErrors({ portfolioName: res });
      });
    });
  };

  function fetchSavedPortfolio() {
    return fetch(
      config.apiUrl + `/api/portfolio/getPortfolios/` + session?.user?.email
    );
  }

  function openPortfolioModal() {
    fetchSavedPortfolio().then((resp) => {
      resp.json().then((res) => {
        let tempPortfolios: any[] = [];
        res.forEach((portfolio: any) => {
          tempPortfolios.push({
            portfolioName: portfolio[2],
            instruments: JSON.parse(portfolio[1]),
          });
        });
        setUserSavedPortfolios(tempPortfolios);
        setShowSavedPortolioModal(true);
      });
    });
  }

  function loadPortfolio(row: any) {
    let tmepvar: any = {};
    row.instruments.forEach(async (instrument: any) => {
      const instrumentData = await generateInstrumentData(
        instrument.instrumentCode,
        selectedTimePeriod
      );
      tmepvar = {
        ...tmepvar,
        [instrument.instrumentCode]: instrumentData,
      };
      // tmepvar = updateWeight(tmepvar, instrument.weightage);
      tmepvar[instrument.instrumentCode].weightage = instrument.weightage;
      setSelectedInstrumentsData(tmepvar);
    });
  }

  const usePrevious = (value: any) => {
    const ref = useRef<any>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  };

  const oldInitialNum = usePrevious(initialAmount);

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
            <ModalContent className="w-full">
              <Form
                className="w-full"
                validationErrors={errors}
                onSubmit={onSubmit}
              >
                <ModalBody className="w-full">
                  <Input
                    label="Portfolio Name"
                    type="text"
                    value={portfolioName}
                    onValueChange={setPortfolioName}
                    name="portfolioName"
                  />
                </ModalBody>
                <ModalFooter className="w-full pt-0">
                  <Button
                    isIconOnly
                    variant="bordered"
                    className="w-full hover:bg-green-200 transition-all"
                    // onPress={() => savePortfolio()}
                    type="submit"
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
              </Form>
            </ModalContent>
          </Modal>

          <Modal
            isDismissable={true}
            isKeyboardDismissDisabled={true}
            isOpen={showSavedPortolioModal}
            hideCloseButton={false}
            className="p-2"
            onClose={() => setShowSavedPortolioModal(false)}
          >
            <ModalContent className="w-full">
              <ModalBody className="w-full">
                {userSavedPortfolios.map((row) => {
                  return (
                    <Card key={row.portfolioName} className="flex p-2 m-1">
                      <div className="col-span-4 flex align-center justify-between p-2">
                        <div className="text-sm flex items-center">
                          {row?.portfolioName}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            isIconOnly
                            variant="bordered"
                            className="hover:bg-green-200 transition-all"
                            onPress={() => loadPortfolio(row)}
                            type="submit"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            isIconOnly
                            variant="bordered"
                            className="hover:bg-red-200 transition-all"
                          >
                            <RxCross2 />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </ModalBody>
              <ModalFooter className="w-full pt-0"></ModalFooter>
            </ModalContent>
          </Modal>
          <div className="w-full gap-2 grid grid-cols-3 grid-rows-1 px-1 max-h-[80vh]">
            <Card className="col-span-1 sm:col-span-1 gap-2 flex p-3 overflow-y-auto">
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
              <div className="flex flex-col gap-2 justify-end">
                <Input
                  label="Initial Amount"
                  type="number"
                  value={initialAmount}
                  onValueChange={(val) => setInitialAmount(val)}
                  name="portfolioName"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    isIconOnly
                    variant="bordered"
                    className="w-full"
                    onPress={() => setShowSavePortfolioNameModal(true)}
                  >
                    <TfiSave />
                  </Button>
                  <Button
                    isIconOnly
                    variant="bordered"
                    className="w-full"
                    onPress={() => openPortfolioModal()}
                  >
                    <CiExport />
                  </Button>
                </div>
              </div>
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
                  initialAmount={initialAmount}
                  oldInitialNum={oldInitialNum}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
