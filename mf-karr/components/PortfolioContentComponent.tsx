"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { IoLockClosed } from "../app/icons";
import { useAsyncList } from "@react-stately/data";
import { addToast } from "@heroui/toast";
import { usePortfolioContext } from "../app/contexts/PortfolioContext";
import { useBacktestContext } from "../app/contexts/BacktestContext";
import { useInvestmentContext } from "../app/contexts/InvestmentContext";
import { useUIContext } from "../app/contexts/UIContext";
import { apiService } from "../app/services/api.service";
import { ToastColor } from "../app/interfaces/interfaces";
import ReplacePortfolioModalComponent from "./ReplacePortfolioModalComponent";
import LoadPortfolioModalComponent from "./LoadPortfolioModalComponent";
import PortfolioNameComponent from "./PortfolioNameComponent";
import PortfolioToolbarComponent from "./PortfolioToolbarComponent";
import PortflioDurationComponent from "./PortfolioDurationComponent";
import PortfolioInstrumentsComponent from "../app/PortfolioInstrumentsComponent";
import PortfolioInvestmentAmountComponent from "./PortfolioInvestmentAmountComponent";
import PortfolioEditBacktestButtonComponent from "./PortfolioEditBacktestButtonComponent";
import PortfolioSearchComponent from "./PortfolioSearchComponent";
import PortfolioChartComponent from "../app/PortfolioChartComponent";
import LoadingOverlayComponent from "./LoadingOverlayComponent";
import { Spinner } from "@nextui-org/react";

// Component for the main portfolio content
export default function PortfolioContentComponent() {
  const { data: session } = useSession();

  // Get values and functions from contexts
  const {
    selectedInstrumentsData,
    isAdjustWeightageEnabled,
    portfolioName,
    isSaveButtonEnabled,
    tableDataWeightageCopy,
    isEditPortfolioName,
    addInstrument,
    removeMutualFund,
    setIsAdjustWeightageEnabled,
    setPortfolioName,
    setIsEditPortfolioName,
    isSaveEnabled,
    onSave,
    onCancelWeightAdjust,
    savePortfolio,
    loadPortfolio,
    replacePortfolio,
    deletePortfolio,
    setTableDataWeightageCopy,
  } = usePortfolioContext();

  const {
    chartData,
    maxDrawdown,
    sharpeRatio,
    initialValue,
    finalValue,
    selectedCompareIndex,
    portfolioMetrics,
    comparePortfolioReturnDiff,
    isEditFunds,
    showCompareSavedPortfolioModal,
    compareSavedPortfolios,
    selectedTimePeriod,
    backtestPortfolio,
    changeCompareIndex,
    loadComparePortfolio,
    setIsEditFunds,
    setShowCompareSavedPortfolioModal,
    setSelectedTimePeriod,
  } = useBacktestContext();

  const {
    isLoading,
    showSavePortfolioNameModal,
    showSavedPortolioModal,
    isCustomTimePeriod,
    startDate,
    endDate,
    modalContent,
    userSavedPortfolios,
    setIsLoading,
    setShowSavePortfolioNameModal,
    setShowSavedPortolioModal,
    setIsCustomTimePeriod,
    setModalContent,
    setUserSavedPortfolios,
  } = useUIContext();

  const { initialAmount, investmentMode, setInitialAmount, setInvestmentMode } =
    useInvestmentContext();

  // Function to call savePortfolio with the current user email
  const handleSavePortfolio = async () => {
    setIsLoading(true);
    try {
      const result = await savePortfolio(session?.user?.email || "");
      if (result.type === "danger" && result.title !== "Duplicate Portfolio") {
        setModalContent(result.title);
        setShowSavePortfolioNameModal(true);
      } else {
        displayToast(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to call replacePortfolio with the current user email
  const handleReplacePortfolio = async () => {
    setIsLoading(true);
    try {
      const result = await replacePortfolio(session?.user?.email || "");
      displayToast(result);
      setShowSavePortfolioNameModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle loading a portfolio
  const handleLoadPortfolio = async (portfolio: any) => {
    setIsLoading(true);
    try {
      setShowSavedPortolioModal(false);
      await loadPortfolio(portfolio, Number(selectedTimePeriod));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle deleting a portfolio
  const handleDeletePortfolio = async (portfolio: any) => {
    setIsLoading(true);
    try {
      await deletePortfolio(portfolio, session?.user?.email || "");
      setShowSavedPortolioModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to display a toast message
  const displayToast = (toastData: { type: ToastColor; title: string }) => {
    addToast({
      title: toastData.title,
      color: toastData.type,
    });
  };

  // Function to open the portfolio modal
  const openPortfolioModal = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.email) {
        const res = await apiService.getPortfolios(session.user.email);
        let tempPortfolios: any[] = [];
        res.forEach((portfolio: any) => {
          tempPortfolios.push({
            portfolioName: portfolio[2],
            instruments: JSON.parse(portfolio[1]),
          });
        });
        setUserSavedPortfolios(tempPortfolios);
        setShowSavedPortolioModal(true);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding an instrument
  const handleAddInstrument = async (instrumentValue: any) => {
    setIsLoading(true);
    try {
      await addInstrument(instrumentValue, selectedTimePeriod.toString());
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle removing a mutual fund
  const handleRemoveMutualFund = async (item: any) => {
    setIsLoading(true);
    try {
      await removeMutualFund(item);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle backtesting the portfolio
  const handleBacktestPortfolio = async () => {
    setIsLoading(true);
    try {
      await backtestPortfolio(
        selectedInstrumentsData,
        Number(selectedTimePeriod),
        Number(initialAmount),
        investmentMode
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Use the async list for searching instruments
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

  const oldInitialNum = initialAmount;

  return (
    <div className="h-full w-full ">
      <ReplacePortfolioModalComponent
        showSavePortfolioNameModal={showSavePortfolioNameModal}
        modalContent={modalContent}
        replacePortfolio={handleReplacePortfolio}
        setShowSavePortfolioNameModal={setShowSavePortfolioNameModal}
      />
      <LoadPortfolioModalComponent
        showSavedPortolioModal={showSavedPortolioModal}
        setShowSavedPortolioModal={setShowSavedPortolioModal}
        userSavedPortfolios={userSavedPortfolios}
        loadPortfolio={handleLoadPortfolio}
        deletePortfolio={handleDeletePortfolio}
      />
      <div className="w-full h-full flex relative">
        <div className="gap-2 w-4/12 flex flex-col ml-2 mr-1 py-2 my-2 rounded-lg bg-gray-500 dark:bg-black overflow-y-auto">
          <div className="relative flex flex-col gap-2 rounded-lg grow px-5 pt-5">
            <div className="flex items-center gap-2">
              <PortfolioNameComponent
                isEditPortfolioName={isEditPortfolioName}
                portfolioName={portfolioName}
                setIsEditPortfolioName={setIsEditPortfolioName}
                setPortfolioName={setPortfolioName}
              />
              <PortfolioToolbarComponent
                savePortfolio={handleSavePortfolio}
                isLoading={isLoading}
                selectedInstrumentsData={selectedInstrumentsData}
                openPortfolioModal={openPortfolioModal}
                isAdjustWeightageEnabled={isAdjustWeightageEnabled}
                isSaveButtonEnabled={isSaveButtonEnabled}
                onSave={onSave}
                onCancelWeightAdjust={onCancelWeightAdjust}
                setIsAdjustWeightageEnabled={setIsAdjustWeightageEnabled}
              />
            </div>
            <PortfolioInstrumentsComponent
              selectedNavData={selectedInstrumentsData}
              removeMututalFundFn={handleRemoveMutualFund}
              timePeriod={Number(selectedTimePeriod)}
              isAdjustWeightageEnabled={isAdjustWeightageEnabled}
              isSaveEnabled={isSaveEnabled}
              tableDataWeightageCopy={tableDataWeightageCopy}
              setTableDataWeightageCopy={setTableDataWeightageCopy}
              isLoading={isLoading}
            />
            <PortflioDurationComponent
              isCustomTimePeriod={isCustomTimePeriod}
              startDate={startDate}
              endDate={endDate}
              setIsCustomTimePeriod={setIsCustomTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
              selectedTimePeriod={selectedTimePeriod}
            />
            <PortfolioInvestmentAmountComponent
              initialAmount={initialAmount}
              setInitialAmount={setInitialAmount}
              isLoading={isLoading}
              investmentMode={investmentMode}
              setInvestmentMode={setInvestmentMode}
            />
            {!isEditFunds && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-lg flex flex-col gap-2 text-center items-center justify-center">
                <IoLockClosed className="text-foreground-400" />
                Please edit funds to unlock this section
              </div>
            )}
          </div>
          <PortfolioEditBacktestButtonComponent
            isEditFunds={isEditFunds}
            backtestPortfolio={handleBacktestPortfolio}
            isLoading={isLoading}
            selectedInstrumentsData={selectedInstrumentsData}
            setIsEditFunds={setIsEditFunds}
          />
        </div>
        <div className="gap-2 h-full w-8/12 flex flex-col">
          <div className="flex flex-col h-full p-5 my-2 ml-1 mr-2 overflow-y-auto dark:bg-black  rounded-lg">
            <div className="flex flex-col gap-3 w-full">
              {isEditFunds ? (
                <PortfolioSearchComponent
                  list={list}
                  addInstrument={handleAddInstrument}
                  isAdjustWeightageEnabled={isAdjustWeightageEnabled}
                  isLoading={isLoading}
                />
              ) : (
                <PortfolioChartComponent
                  investmentMode={investmentMode}
                  initialAmount={initialAmount}
                  oldInitialNum={oldInitialNum}
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
        {isLoading && <LoadingOverlayComponent message="Loading data" />}
      </div>
    </div>
  );
}
