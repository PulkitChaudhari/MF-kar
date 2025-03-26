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
  Divider,
  Calendar,
  DateInput,
} from "@nextui-org/react";
import { FaRegEdit } from "react-icons/fa";
import { parseDate } from "@internationalized/date";
import { useAsyncList } from "@react-stately/data";
import { GiInjustice } from "react-icons/gi";
import { TfiSave } from "react-icons/tfi";
import { RxCross2 } from "react-icons/rx";
import PortfolioChart from "./portfolioChart";
import PortfolioTable from "./portfolioTable";
import { cagrValues } from "./constants";
import { useSession, signIn } from "next-auth/react";
import { FaCheck } from "react-icons/fa6";
import { CiExport } from "react-icons/ci";
import { apiService } from "./services/api.service";
import { VscGraphLine } from "react-icons/vsc";
import { MdModeEditOutline } from "react-icons/md";
import { addToast } from "@heroui/toast";
import { ToastColor } from "./interfaces/interfaces";

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
  const [portfolioName, setPortfolioName] = useState("Your Portfolio Name");
  const [errors, setErrors] = useState({});
  const [showSavedPortolioModal, setShowSavedPortolioModal] =
    useState<boolean>(false);
  const [userSavedPortfolios, setUserSavedPortfolios] = useState<any[]>([]);
  const { data: session } = useSession();
  const [initialAmount, setInitialAmount] = useState<string>("100");
  const [investmentMode, setInvestmentMode] = useState<any>("lumpsum");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);
  const [sharpeRatio, setSharpeRatio] = useState<number>(0);
  // const [chartData, setChartData] = useState<any[]>([]);
  const [initialValue, setInitialValue] = useState(100);
  const [finalValue, setFinalValue] = useState(100);
  const [selectedCompareIndex, setSelectedCompareIndex] =
    useState<string>("Nifty 50");
  const [showCompareSavedPortfolioModal, setShowCompareSavedPortfolioModal] =
    useState<boolean>(false);
  const [compareSavedPortfolios, setCompareSavedPortfolios] = useState<any[]>(
    []
  );
  const [isCustomTimePeriod, setIsCustomTimePeriod] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>(parseDate("2024-04-04"));
  const [endDate, setEndDate] = useState<any>(parseDate("2024-04-04"));
  const [isEditFunds, setIsEditFunds] = useState<boolean>(true);
  const [portfolioMetrics, setPortfolioMetrics] = useState<any[]>([]);
  const [comparePortfolioReturnDiff, setComparePortfolioReturnDiff] =
    useState<any>(0);
  const [isEditPortfolioName, setIsEditPortfolioName] =
    useState<boolean>(false);

  const CalendarIcon = (props: any) => {
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
          d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"
          fill="currentColor"
        />
        <path
          clipRule="evenodd"
          d="M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    );
  };

  async function addInstrument(instrumentValue: any) {
    if (instrumentValue !== null) {
      setIsLoading(true);
      try {
        const updatedInstruments = await apiService.addInstrument(
          instrumentValue,
          selectedTimePeriod.toString(),
          selectedInstrumentsData
        );
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
      const updatedInstruments = await apiService.removeInstrument(
        item.instrumentCode,
        selectedInstrumentsData
      );
      setSelectedInstrumentsData(updatedInstruments);
    } catch (error) {
      console.error("Error removing instrument:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function loadPortfolio(row: any) {
    setIsLoading(true);
    try {
      const loadedPortfolio = await apiService.loadPortfolio(
        row,
        Number(selectedTimePeriod)
      );
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
      let json = await apiService.searchInstruments(filterText || "");
      json = json.filter((scheme: any) => {
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

  function displayToast(toastData: {
    type: ToastColor;
    title: string;
    description: string;
  }) {
    addToast({
      title: toastData.title,
      description: toastData.description,
      color: toastData.type,
    });
  }

  async function savePortfolio() {
    const toBeSentData: any[] = [];
    Object.keys(selectedInstrumentsData).forEach((key) => {
      const weightage = selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });

    return apiService
      .savePortfolio(session?.user?.email || "", toBeSentData, portfolioName)
      .then((toastData: any) => {
        displayToast(toastData);
      });
  }

  function fetchSavedPortfolio() {
    if (session?.user?.email) {
      return apiService.getPortfolios(session.user.email);
    }
    return Promise.resolve([]);
  }

  function openPortfolioModal() {
    fetchSavedPortfolio().then((res) => {
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
  }

  const usePrevious = (value: any) => {
    const ref = useRef<any>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  };

  const oldInitialNum = usePrevious(initialAmount);

  async function backtestPortfolio() {
    setIsLoading(true);
    try {
      const data = await apiService.analyzePortfolio(
        selectedInstrumentsData,
        Number(selectedTimePeriod),
        Number(initialAmount),
        investmentMode
      );
      // setChartData(data.chartData);
      setMaxDrawdown(data.metrics.maxDrawdown);
      setSharpeRatio(data.metrics.sharpeRatio);
      setInitialValue(data.metrics.initialValue);
      setFinalValue(data.metrics.finalValue);
      setIsEditFunds(false);
      changeCompareIndex(data, "nifty_50");
    } catch (error) {
      console.error("Error fetching portfolio analysis:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch index comparison data
  async function fetchIndexComparison(data: any, indexName: string) {
    try {
      const indexData = await apiService.compareIndex(
        indexName,
        Number(selectedTimePeriod),
        Number(initialAmount),
        investmentMode.toString()
      );
      // Merge index data with portfolio data
      const updatedChartData = data.chartData.map((item: any, index: any) => ({
        ...item,
        navIndex: indexData.chartData[index]?.nav || 0,
      }));
      const tempPortfolioMetrics = [];
      tempPortfolioMetrics.push({
        name: "Your Portfolio",
        maxDrawdown: data.metrics.maxDrawdown,
        sharpeRatio: data.metrics.sharpeRatio,
        initialAmount: data.metrics.initialValue,
        finalValue: data.metrics.finalValue,
        xirr: 1,
        gain: 10,
      });
      tempPortfolioMetrics.push({
        name: "Compared Index/Portfolio",
        maxDrawdown: indexData.metrics.maxDrawdown,
        sharpeRatio: indexData.metrics.sharpeRatio,
        initialAmount: indexData.metrics.initialValue,
        finalValue: indexData.metrics.finalValue,
        xirr: 1,
        gain: 10,
      });
      setComparePortfolioReturnDiff(
        updatedChartData[updatedChartData.length - 1].nav -
          updatedChartData[updatedChartData.length - 1].navIndex
      );
      setPortfolioMetrics(tempPortfolioMetrics);
      setChartData(updatedChartData);
    } catch (error) {
      console.error("Error fetching index comparison:", error);
    }
  }

  async function changeCompareIndex(data: any, indexKey: any) {
    if (indexKey === "nifty_50") {
      await fetchIndexComparison(data, indexKey);
      setSelectedCompareIndex("Nifty 50");
    } else if (indexKey === "saved_portfolios") {
      openComparePortfolioModal();
    }
  }

  function openComparePortfolioModal() {
    fetchSavedPortfolio().then((res) => {
      let tempPortfolios: any[] = [];
      res.forEach((portfolio: any) => {
        tempPortfolios.push({
          portfolioName: portfolio[2],
          instruments: JSON.parse(portfolio[1]),
        });
      });
      setCompareSavedPortfolios(tempPortfolios);
      setShowCompareSavedPortfolioModal(true);
    });
  }

  // Load portfolio data
  async function loadComparePortfolio(row: any) {
    setIsLoading(true);
    try {
      const loadedPortfolio = await apiService.loadPortfolio(
        row,
        Number(selectedTimePeriod)
      );

      // Create a copy of the chart data with the comparison portfolio
      const portfolioData = await apiService.analyzePortfolio(
        loadedPortfolio,
        Number(selectedTimePeriod),
        Number(initialAmount),
        investmentMode
      );

      // Merge the comparison portfolio data with the current chart data
      const updatedChartData = chartData.map((item, index) => ({
        ...item,
        navIndex: portfolioData.chartData[index]?.nav || 0,
      }));

      setChartData(updatedChartData);
      setSelectedCompareIndex("Saved Portfolios");
      setShowCompareSavedPortfolioModal(false);
    } catch (error) {
      console.error("Error loading portfolio for comparison:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full w-full">
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
        <div className="h-full w-full">
          <Modal
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={showSavePortfolioNameModal}
            hideCloseButton={true}
            className="p-2"
          >
            <ModalContent className="w-full">
              <Form className="w-full" validationErrors={errors}>
                <ModalBody className="w-full">
                  <Input
                    label="Portfolio Name"
                    type="text"
                    value={portfolioName}
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
          <div className="w-full h-full flex">
            <div className="gap-2 h-full w-4/12 flex flex-col">
              <div className="bg-gray-950 flex flex-col h-full p-5 ml-2 mr-1 my-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-1/2">
                    <div className="group cursor-pointer">
                      <div
                        className={
                          isEditPortfolioName
                            ? "flex gap-2 items-center w-full h-full"
                            : "pb-[5px] h-full w-full flex gap-2 items-center text-sm border-b-2 border-transparent group-hover:border-dotted group-hover:border-current"
                        }
                      >
                        {isEditPortfolioName ? (
                          <Input
                            type="text"
                            variant="underlined"
                            value={portfolioName}
                            onFocusChange={(eve) => {
                              setIsEditPortfolioName(eve);
                            }}
                            size="sm"
                            className="h-full"
                            autoFocus={isEditPortfolioName}
                            onValueChange={setPortfolioName}
                          />
                        ) : (
                          <div className="flex gap-2 w-full items-center overflow-hidden">
                            <p className="text-sm whitespace-nowrap overflow-ellipsis overflow-hidden">
                              {portfolioName}
                            </p>
                            <MdModeEditOutline
                              onClick={() => setIsEditPortfolioName(true)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    variant="bordered"
                    onPress={() => savePortfolio()}
                    isDisabled={
                      isLoading ||
                      Object.keys(selectedInstrumentsData).length === 0
                    }
                    size="sm"
                  >
                    <TfiSave />
                  </Button>
                  <Button
                    isIconOnly
                    variant="bordered"
                    onPress={() => openPortfolioModal()}
                    isDisabled={isLoading}
                    size="sm"
                  >
                    <CiExport />
                  </Button>
                  <div className="flex-1 ">
                    {isAdjustWeightageEnabled ? (
                      <div className="flex gap-2 w-full">
                        <Button
                          isIconOnly
                          aria-label="Like"
                          color="success"
                          className="w-full"
                          isDisabled={!isSaveButtonEnabled}
                          onPress={() => onSave()}
                          size="sm"
                        >
                          <FaCheck />
                        </Button>
                        <Button
                          isIconOnly
                          aria-label="Like1"
                          color="danger"
                          onPress={() => onCancelWeightAdjust()}
                          size="sm"
                          className="w-full"
                        >
                          <RxCross2 />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        isIconOnly
                        variant="bordered"
                        onPress={() => setIsAdjustWeightageEnabled(true)}
                        isDisabled={isLoading}
                        size="sm"
                        className="w-full"
                      >
                        <GiInjustice />
                      </Button>
                    )}
                  </div>
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
                <div className="my-1 flex flex-col gap-1">
                  <div className="flex items-center my-2">
                    <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                    <b className="mx-3 text-sm whitespace-nowrap">
                      Edit Time period
                    </b>
                    <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                  </div>
                  <div className="mx-[5px]">
                    {isCustomTimePeriod ? (
                      <div className="flex gap-2 items-end overflow-y-auto">
                        <DateInput
                          label="From"
                          labelPlacement="outside"
                          startContent={
                            <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          size="sm"
                          value={startDate}
                          onChange={(date) => console.log(date)}
                        />
                        <DateInput
                          label="To"
                          labelPlacement="outside"
                          startContent={
                            <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                          }
                          size="sm"
                          value={endDate}
                          onChange={(date) => console.log(date)}
                        />
                        <Button
                          variant="bordered"
                          size="sm"
                          onPress={() => {
                            setIsCustomTimePeriod(false);
                          }}
                        >
                          <RxCross2 />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2 overflow-y-auto">
                        {cagrValues.map((year) => {
                          return (
                            <Button
                              variant="bordered"
                              size="sm"
                              key={year.key}
                              onPress={() => setSelectedTimePeriod(year.key)}
                              isDisabled={selectedTimePeriod == year.key}
                            >
                              {year.label}
                            </Button>
                          );
                        })}
                        <Button
                          className="flex-1"
                          variant="bordered"
                          size="sm"
                          onPress={() => {
                            setIsCustomTimePeriod(true);
                          }}
                        >
                          Custom
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="my-1 flex flex-col gap-1">
                  <div className="flex items-center my-2">
                    <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                    <b className="mx-3 text-sm whitespace-nowrap">
                      Investment Amount
                    </b>
                    <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                  </div>
                  <div className="flex flex-col gap-2 justify-end">
                    <div className="flex w-full gap-2 items-center">
                      <Input
                        type="number"
                        value={initialAmount}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              ₹
                            </span>
                          </div>
                        }
                        variant="bordered"
                        onValueChange={(val) => setInitialAmount(val)}
                        name="portfolioName"
                        isDisabled={isLoading}
                        size="md"
                        placeholder="Initial Amount"
                        // labelPlacement="outside-left"
                        labelPlacement="inside"
                      />
                      <Tabs
                        aria-label="Options"
                        fullWidth
                        selectedKey={investmentMode}
                        size="md"
                        onSelectionChange={setInvestmentMode}
                        isDisabled={isLoading}
                        variant="bordered"
                      >
                        <Tab key="lumpsum" title="Lumpsum"></Tab>
                        <Tab key="monthly-sip" title="Monthly Sip"></Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
                <div className="flex my-1 gap-2 justify-end">
                  <Button
                    variant="bordered"
                    className="w-full"
                    onPress={() => backtestPortfolio()}
                    isDisabled={
                      isLoading ||
                      Object.keys(selectedInstrumentsData).length === 0
                    }
                  >
                    Backtest <VscGraphLine />
                  </Button>
                  <Button
                    variant="bordered"
                    className="w-full"
                    onPress={() => setIsEditFunds(true)}
                  >
                    Edit Funds <FaRegEdit />
                  </Button>
                </div>
              </div>
            </div>
            <div
              // className="h-full w-8/12">
              className="gap-2 h-full w-8/12 flex flex-col"
            >
              <div className="bg-gray-950 flex flex-col h-full p-5 my-2 ml-1 mr-2 overflow-y-auto rounded-lg">
                <div className="flex flex-col gap-3 w-full">
                  {isEditFunds ? (
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
                  ) : (
                    <PortfolioChart
                      investmentMode={investmentMode}
                      initialAmount={initialAmount}
                      oldInitialNum={oldInitialNum || initialAmount}
                      chartData={chartData}
                      maxDrawdown={maxDrawdown}
                      sharpeRatio={sharpeRatio}
                      initialValue={initialValue}
                      finalValue={finalValue}
                      changeCompareIndex={changeCompareIndex}
                      selectedCompareIndex={selectedCompareIndex}
                      loadComparePortfolio={loadComparePortfolio}
                      showCompareSavedPortfolioModal={
                        showCompareSavedPortfolioModal
                      }
                      setShowCompareSavedPortfolioModal={
                        setShowCompareSavedPortfolioModal
                      }
                      compareSavedPortfolios={compareSavedPortfolios}
                      isLoading={isLoading}
                      portfolioMetrics={portfolioMetrics}
                      comparePortfolioReturnDiff={comparePortfolioReturnDiff}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
