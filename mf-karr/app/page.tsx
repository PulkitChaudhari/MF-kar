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
  Tab,
  Tabs,
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

export default function Home() {
  const [isAdjustWeightageEnabled, setIsAdjustWeightageEnabled] =
    useState<boolean>(false);
  const [toBeData, setToBeData] = useState<any[]>([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<String>("1");
  const [tableDataWeightageCopy, setTableDataWeightageCopy] = useState<any[]>(
    []
  );
  const [selectedInstrumentsData, setSelectedInstrumentsData] = useState<any>(
    {}
  );
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] =
    useState<boolean>(false);
  const [showSavePortfolioNameModal, setShowSavePortfolioNameModal] =
    useState<boolean>(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [errors, setErrors] = useState({});
  const [showSavedPortolioModal, setShowSavedPortolioModal] =
    useState<boolean>(false);
  const [userSavedPortfolios, setUserSavedPortfolios] = useState<any[]>([]);
  const { data: session } = useSession();
  const [initialAmount, setInitialAmount] = useState<string>("100");
  const [investmentMode, setInvestmentMode] = useState<any>("lumpsum");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function addInstrument(instrumentValue: any) {
    if (instrumentValue !== null) {
      setIsLoading(true);
      try {
        const response = await fetch(
          config.apiUrl + `/api/portfolio/add-instrument`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              instrumentCode: instrumentValue,
              timePeriod: selectedTimePeriod,
              currentInstruments: selectedInstrumentsData,
            }),
          }
        );

        const updatedInstruments = await response.json();
        setSelectedInstrumentsData(updatedInstruments);
      } catch (error) {
        console.error("Error adding instrument:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const removeMutualFund = async (item: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        config.apiUrl + `/api/portfolio/remove-instrument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instrumentCode: item.instrumentCode,
            currentInstruments: selectedInstrumentsData,
          }),
        }
      );

      const updatedInstruments = await response.json();
      setSelectedInstrumentsData(updatedInstruments);
    } catch (error) {
      console.error("Error removing instrument:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function changeTimePeriod(timePeriod: any) {
    setIsLoading(true);
    try {
      const response = await fetch(
        config.apiUrl + `/api/portfolio/change-time-period`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timePeriod: timePeriod,
            currentInstruments: selectedInstrumentsData,
          }),
        }
      );

      const updatedInstruments = await response.json();
      setSelectedInstrumentsData(updatedInstruments);
      setSelectedTimePeriod(timePeriod.toString());
    } catch (error) {
      console.error("Error changing time period:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadPortfolio(row: any) {
    setIsLoading(true);
    try {
      const response = await fetch(config.apiUrl + `/api/portfolio/load`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioData: row,
          timePeriod: selectedTimePeriod,
        }),
      });

      const loadedPortfolio = await response.json();
      setSelectedInstrumentsData(loadedPortfolio);
      setShowSavedPortolioModal(false);
    } catch (error) {
      console.error("Error loading portfolio:", error);
    } finally {
      setIsLoading(false);
    }
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
    await savePortfolio(data).then((resp) => {
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
                <Dropdown
                  isDisabled={isAdjustWeightageEnabled || isLoading}
                  id="line-graph"
                >
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
                    isDisabled={isLoading}
                  >
                    <GiInjustice />
                  </Button>
                )}
              </div>
              <PortfolioTable
                selectedNavData={selectedInstrumentsData}
                removeMututalFundFn={removeMutualFund}
                timePeriod={Number(selectedTimePeriod)}
                isAdjustWeightageEnabled={isAdjustWeightageEnabled}
                isSaveEnabled={isSaveEnabled}
                tableDataWeightageCopy={tableDataWeightageCopy}
                setTableDataWeightageCopy={setTableDataWeightageCopy}
                isLoading={isLoading}
              />
              <div className="flex flex-col gap-2 justify-end">
                <div className="flex w-full gap-2">
                  <Input
                    label={
                      investmentMode == "lumpsum"
                        ? "Initial Amount"
                        : "Monthly SIP Amount"
                    }
                    type="number"
                    value={initialAmount}
                    onValueChange={(val) => setInitialAmount(val)}
                    name="portfolioName"
                    isDisabled={isLoading}
                  />
                  <Tabs
                    aria-label="Options"
                    fullWidth
                    selectedKey={investmentMode}
                    size="md"
                    onSelectionChange={setInvestmentMode}
                    isDisabled={isLoading}
                  >
                    <Tab key="lumpsum" title="Lumpsum"></Tab>
                    <Tab key="monthly-sip" title="Monthly Sip"></Tab>
                  </Tabs>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    isIconOnly
                    variant="bordered"
                    className="w-full"
                    onPress={() => setShowSavePortfolioNameModal(true)}
                    isDisabled={
                      isLoading ||
                      Object.keys(selectedInstrumentsData).length === 0
                    }
                  >
                    <TfiSave />
                  </Button>
                  <Button
                    isIconOnly
                    variant="bordered"
                    className="w-full"
                    onPress={() => openPortfolioModal()}
                    isDisabled={isLoading}
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
                  isDisabled={isAdjustWeightageEnabled || isLoading}
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
                  investmentMode={investmentMode}
                  instrumentsData={selectedInstrumentsData}
                  timePeriod={Number(selectedTimePeriod)}
                  initialAmount={initialAmount}
                  oldInitialNum={oldInitialNum || initialAmount}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
