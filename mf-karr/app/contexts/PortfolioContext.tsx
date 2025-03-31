"use client";
import React, { createContext, useContext, useState } from "react";
import { apiService } from "../services/api.service";
import { ToastColor } from "../interfaces/interfaces";
import { addToast } from "@heroui/toast";

// Define the context type
type PortfolioContextType = {
  selectedInstrumentsData: any;
  isAdjustWeightageEnabled: boolean;
  portfolioName: string;
  isSaveButtonEnabled: boolean;
  toBeData: any[];
  tableDataWeightageCopy: any[];
  isEditPortfolioName: boolean;

  // Portfolio actions
  addInstrument: (
    instrumentValue: any,
    selectedTimePeriod: string
  ) => Promise<void>;
  removeMutualFund: (item: any) => Promise<void>;
  setIsAdjustWeightageEnabled: (value: boolean) => void;
  setPortfolioName: (name: string) => void;
  setIsEditPortfolioName: (value: boolean) => void;
  isSaveEnabled: (posSelectedInstrumentsData: any[]) => void;
  onSave: (toBeDataWeightage?: any, instrumentsData?: any) => void;
  onCancelWeightAdjust: () => void;
  savePortfolio: (userEmail: string) => Promise<any>;
  loadPortfolio: (portfolio: any, timePeriod: number) => Promise<void>;
  replacePortfolio: (userEmail: string) => Promise<any>;
  deletePortfolio: (portfolio: any, userEmail: string) => Promise<void>;
  setTableDataWeightageCopy: (data: any[]) => void;
};

// Create the context with default values
const PortfolioContext = createContext<PortfolioContextType>({
  selectedInstrumentsData: {},
  isAdjustWeightageEnabled: false,
  portfolioName: "Your Portfolio Name",
  isSaveButtonEnabled: false,
  toBeData: [],
  tableDataWeightageCopy: [],
  isEditPortfolioName: false,

  // Default functions (will be overridden by provider)
  addInstrument: async () => {},
  removeMutualFund: async () => {},
  setIsAdjustWeightageEnabled: () => {},
  setPortfolioName: () => {},
  setIsEditPortfolioName: () => {},
  isSaveEnabled: () => {},
  onSave: () => {},
  onCancelWeightAdjust: () => {},
  savePortfolio: async () => ({}),
  loadPortfolio: async () => {},
  replacePortfolio: async () => ({}),
  deletePortfolio: async () => {},
  setTableDataWeightageCopy: () => {},
});

// Provider component
export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedInstrumentsData, setSelectedInstrumentsData] = useState<any>(
    {}
  );
  const [isAdjustWeightageEnabled, setIsAdjustWeightageEnabled] =
    useState<boolean>(false);
  const [portfolioName, setPortfolioName] = useState("Your Portfolio Name");
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] =
    useState<boolean>(false);
  const [toBeData, setToBeData] = useState<any[]>([]);
  const [tableDataWeightageCopy, setTableDataWeightageCopy] = useState<any[]>(
    []
  );
  const [isEditPortfolioName, setIsEditPortfolioName] =
    useState<boolean>(false);

  const displayToast = (toastData: { type: ToastColor; title: string }) => {
    addToast({
      title: toastData.title,
      color: toastData.type,
    });
  };

  const addInstrument = async (
    instrumentValue: any,
    selectedTimePeriod: string
  ) => {
    if (instrumentValue !== null) {
      try {
        const updatedInstruments = await apiService.addInstrument(
          instrumentValue,
          selectedTimePeriod,
          selectedInstrumentsData
        );
        setSelectedInstrumentsData(updatedInstruments);
      } catch (error) {
        console.error("Error adding instrument:", error);
      }
    }
  };

  const removeMutualFund = async (item: any) => {
    try {
      const updatedInstruments = await apiService.removeInstrument(
        item.instrumentCode,
        selectedInstrumentsData
      );
      setSelectedInstrumentsData(updatedInstruments);
    } catch (error) {
      console.error("Error removing instrument:", error);
    }
  };

  const isSaveEnabled = (posSelectedInstrumentsData: any[]): void => {
    let totalWeightage = 0;
    posSelectedInstrumentsData.forEach((data: any) => {
      totalWeightage += Number(data.weightage);
    });
    if (totalWeightage == 100) setIsSaveButtonEnabled(true);
    else setIsSaveButtonEnabled(false);
    setToBeData(posSelectedInstrumentsData);
  };

  const onSave = (
    toBeDataWeightage: any = toBeData,
    instrumentsData: any = selectedInstrumentsData
  ) => {
    let keysArr = Object.keys(instrumentsData);
    let tempData = { ...instrumentsData };
    toBeDataWeightage.forEach((data: any) => {
      if (keysArr.includes(data.instrumentCode)) {
        tempData[data.instrumentCode].weightage = Number(data.weightage);
      }
    });
    setSelectedInstrumentsData(tempData);
    setIsAdjustWeightageEnabled(false);
  };

  const onCancelWeightAdjust = () => {
    setSelectedInstrumentsData({ ...selectedInstrumentsData });
    setIsAdjustWeightageEnabled(false);
  };

  const savePortfolio = async (userEmail: string) => {
    const toBeSentData: any[] = [];
    Object.keys(selectedInstrumentsData).forEach((key) => {
      const weightage = selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });

    return apiService.savePortfolio(userEmail, toBeSentData, portfolioName);
  };

  const loadPortfolio = async (portfolio: any, timePeriod: number) => {
    try {
      const loadedPortfolio = await apiService.loadPortfolio(
        portfolio,
        timePeriod
      );
      setPortfolioName(portfolio.portfolioName);
      setSelectedInstrumentsData(loadedPortfolio);
      return loadedPortfolio;
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const replacePortfolio = async (userEmail: string) => {
    const toBeSentData: any[] = [];
    Object.keys(selectedInstrumentsData).forEach((key) => {
      const weightage = selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });

    return apiService.replacePortfolio(userEmail, toBeSentData, portfolioName);
  };

  const deletePortfolio = async (portfolio: any, userEmail: string) => {
    try {
      const result = await apiService.deletePortfolio(
        userEmail,
        portfolio.portfolioName
      );
      displayToast(result);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        selectedInstrumentsData,
        isAdjustWeightageEnabled,
        portfolioName,
        isSaveButtonEnabled,
        toBeData,
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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the portfolio context
export const usePortfolioContext = () => useContext(PortfolioContext);
