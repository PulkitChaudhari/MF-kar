"use client";
import React, { createContext, useContext, useReducer } from "react";
import { apiService } from "../services/api.service";
import {
  PortfolioState,
  PortfolioContextType,
  ToastColor,
} from "../interfaces/interfaces";
import { addToast } from "@heroui/toast";

const DEFAULT_PORTFOLIO_NAME = "Your Portfolio Name";
const DEFAULT_INITIAL_AMOUNT = "100";
const DEFAULT_INVESTMENT_MODE = "lumpsum";

const initialState: PortfolioState = {
  selectedInstrumentsData: {},
  isAdjustWeightageEnabled: false,
  portfolioName: DEFAULT_PORTFOLIO_NAME,
  isSaveButtonEnabled: false,
  toBeData: [],
  tableDataWeightageCopy: [],
  isEditPortfolioName: false,
  // Investment properties
  initialAmount: DEFAULT_INITIAL_AMOUNT,
  investmentMode: DEFAULT_INVESTMENT_MODE,
};

// Action types
type ActionType =
  | { type: "SET_SELECTED_INSTRUMENTS_DATA"; payload: any }
  | { type: "SET_ADJUST_WEIGHTAGE_ENABLED"; payload: boolean }
  | { type: "SET_PORTFOLIO_NAME"; payload: string }
  | { type: "SET_SAVE_BUTTON_ENABLED"; payload: boolean }
  | { type: "SET_TO_BE_DATA"; payload: any[] }
  | { type: "SET_TABLE_DATA_WEIGHTAGE_COPY"; payload: any[] }
  | { type: "SET_EDIT_PORTFOLIO_NAME"; payload: boolean }
  | { type: "SET_INITIAL_AMOUNT"; payload: string }
  | { type: "SET_INVESTMENT_MODE"; payload: string };

// Reducer function
function portfolioReducer(
  state: PortfolioState,
  action: ActionType
): PortfolioState {
  switch (action.type) {
    case "SET_SELECTED_INSTRUMENTS_DATA":
      return { ...state, selectedInstrumentsData: action.payload };
    case "SET_ADJUST_WEIGHTAGE_ENABLED":
      return { ...state, isAdjustWeightageEnabled: action.payload };
    case "SET_PORTFOLIO_NAME":
      return { ...state, portfolioName: action.payload };
    case "SET_SAVE_BUTTON_ENABLED":
      return { ...state, isSaveButtonEnabled: action.payload };
    case "SET_TO_BE_DATA":
      return { ...state, toBeData: action.payload };
    case "SET_TABLE_DATA_WEIGHTAGE_COPY":
      return { ...state, tableDataWeightageCopy: action.payload };
    case "SET_EDIT_PORTFOLIO_NAME":
      return { ...state, isEditPortfolioName: action.payload };
    case "SET_INITIAL_AMOUNT":
      return { ...state, initialAmount: action.payload };
    case "SET_INVESTMENT_MODE":
      return { ...state, investmentMode: action.payload };
    default:
      return state;
  }
}

const PortfolioContext = createContext<PortfolioContextType>({
  ...initialState,
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
  setInitialAmount: () => {},
  setInvestmentMode: () => {},
});

const displayToast = (toastData: { type: ToastColor; title: string }) => {
  addToast({
    title: toastData.title,
    color: toastData.type,
  });
};

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  const setSelectedInstrumentsData = (data: any) =>
    dispatch({ type: "SET_SELECTED_INSTRUMENTS_DATA", payload: data });

  const setIsAdjustWeightageEnabled = (value: boolean) =>
    dispatch({ type: "SET_ADJUST_WEIGHTAGE_ENABLED", payload: value });

  const setPortfolioName = (name: string) =>
    dispatch({ type: "SET_PORTFOLIO_NAME", payload: name });

  const setIsSaveButtonEnabled = (value: boolean) =>
    dispatch({ type: "SET_SAVE_BUTTON_ENABLED", payload: value });

  const setToBeData = (data: any[]) =>
    dispatch({ type: "SET_TO_BE_DATA", payload: data });

  const setTableDataWeightageCopy = (data: any[]) =>
    dispatch({ type: "SET_TABLE_DATA_WEIGHTAGE_COPY", payload: data });

  const setIsEditPortfolioName = (value: boolean) =>
    dispatch({ type: "SET_EDIT_PORTFOLIO_NAME", payload: value });

  const setInitialAmount = (amount: string) =>
    dispatch({ type: "SET_INITIAL_AMOUNT", payload: amount });

  const setInvestmentMode = (mode: string) =>
    dispatch({ type: "SET_INVESTMENT_MODE", payload: mode });

  const addInstrument = async (
    instrumentValue: any,
    selectedTimePeriod: string
  ) => {
    if (instrumentValue !== null) {
      try {
        const updatedInstruments = await apiService.addInstrument(
          instrumentValue,
          selectedTimePeriod,
          state.selectedInstrumentsData
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
        state.selectedInstrumentsData
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
    setIsSaveButtonEnabled(totalWeightage === 100);
    setToBeData(posSelectedInstrumentsData);
  };

  const onSave = (
    toBeDataWeightage: any = state.toBeData,
    instrumentsData: any = state.selectedInstrumentsData
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
    setSelectedInstrumentsData({ ...state.selectedInstrumentsData });
    setIsAdjustWeightageEnabled(false);
  };

  const savePortfolio = async (userEmail: string) => {
    const toBeSentData: any[] = [];
    Object.keys(state.selectedInstrumentsData).forEach((key) => {
      const weightage = state.selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });

    return apiService.savePortfolio(
      userEmail,
      toBeSentData,
      state.portfolioName
    );
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
    Object.keys(state.selectedInstrumentsData).forEach((key) => {
      const weightage = state.selectedInstrumentsData[key].weightage;
      toBeSentData.push({ instrumentCode: key, weightage: weightage });
    });

    return apiService.replacePortfolio(
      userEmail,
      toBeSentData,
      state.portfolioName
    );
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
        ...state,
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
        setInitialAmount,
        setInvestmentMode,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => useContext(PortfolioContext);
