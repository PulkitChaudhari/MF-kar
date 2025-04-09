"use client";
import React, { createContext, useContext, useReducer } from "react";
import { apiService } from "../services/api.service";
import {
  PortfolioState,
  PortfolioContextType,
  ToastColor,
} from "../interfaces/interfaces";
import { addToast } from "@heroui/toast";
import { parseDate } from "@internationalized/date";

const DEFAULT_PORTFOLIO_NAME = "Your Portfolio Name";
const DEFAULT_INITIAL_AMOUNT = "100";
const DEFAULT_INVESTMENT_MODE = "lumpsum";
const DEFAULT_DATE = parseDate("2024-04-04");
const DEFAULT_TIME_PERIOD = "1";

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
  showSavePortfolioNameModal: false,
  showSavedPortolioModal: false,
  showCompareSavedPortfolioModal: false,
  isCustomTimePeriod: false,
  startDate: DEFAULT_DATE,
  endDate: DEFAULT_DATE,
  selectedTimePeriod: DEFAULT_TIME_PERIOD,
  modalContent: "",
  userSavedPortfolios: [],
  compareSavedPortfolios: [],
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
  | { type: "SET_INVESTMENT_MODE"; payload: string }
  | { type: "SET_SAVE_PORTFOLIO_MODAL"; payload: boolean }
  | { type: "SET_SAVED_PORTFOLIO_MODAL"; payload: boolean }
  | { type: "SET_COMPARE_SAVED_PORTFOLIO_MODAL"; payload: boolean }
  | { type: "SET_CUSTOM_TIME_PERIOD"; payload: boolean }
  | { type: "SET_START_DATE"; payload: any }
  | { type: "SET_END_DATE"; payload: any }
  | { type: "SET_TIME_PERIOD"; payload: string }
  | { type: "SET_MODAL_CONTENT"; payload: string }
  | { type: "SET_USER_SAVED_PORTFOLIOS"; payload: any[] }
  | { type: "SET_COMPARE_SAVED_PORTFOLIOS"; payload: any[] };

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
    case "SET_SAVE_PORTFOLIO_MODAL":
      return { ...state, showSavePortfolioNameModal: action.payload };
    case "SET_SAVED_PORTFOLIO_MODAL":
      return { ...state, showSavedPortolioModal: action.payload };
    case "SET_COMPARE_SAVED_PORTFOLIO_MODAL":
      return { ...state, showCompareSavedPortfolioModal: action.payload };
    case "SET_CUSTOM_TIME_PERIOD":
      return { ...state, isCustomTimePeriod: action.payload };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "SET_TIME_PERIOD":
      return { ...state, selectedTimePeriod: action.payload };
    case "SET_MODAL_CONTENT":
      return { ...state, modalContent: action.payload };
    case "SET_USER_SAVED_PORTFOLIOS":
      return { ...state, userSavedPortfolios: action.payload };
    case "SET_COMPARE_SAVED_PORTFOLIOS":
      return { ...state, compareSavedPortfolios: action.payload };
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
  setShowSavePortfolioNameModal: () => {},
  setShowSavedPortolioModal: () => {},
  setShowCompareSavedPortfolioModal: () => {},
  setIsCustomTimePeriod: () => {},
  setStartDate: () => {},
  setEndDate: () => {},
  setSelectedTimePeriod: () => {},
  setModalContent: () => {},
  setUserSavedPortfolios: () => {},
  setCompareSavedPortfolios: () => {},
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

  const setInvestmentMode = (mode: any) =>
    dispatch({ type: "SET_INVESTMENT_MODE", payload: mode });

  const setShowSavePortfolioNameModal = (value: boolean) =>
    dispatch({ type: "SET_SAVE_PORTFOLIO_MODAL", payload: value });

  const setShowSavedPortolioModal = (value: boolean) => {
    console.log(value);
    dispatch({ type: "SET_SAVED_PORTFOLIO_MODAL", payload: value });
  };

  const setShowCompareSavedPortfolioModal = (value: boolean) =>
    dispatch({ type: "SET_COMPARE_SAVED_PORTFOLIO_MODAL", payload: value });

  const setIsCustomTimePeriod = (value: boolean) =>
    dispatch({ type: "SET_CUSTOM_TIME_PERIOD", payload: value });

  const setStartDate = (date: any) =>
    dispatch({ type: "SET_START_DATE", payload: date });

  const setEndDate = (date: any) =>
    dispatch({ type: "SET_END_DATE", payload: date });

  const setSelectedTimePeriod = (period: string) =>
    dispatch({ type: "SET_TIME_PERIOD", payload: period });

  const setModalContent = (content: string) =>
    dispatch({ type: "SET_MODAL_CONTENT", payload: content });

  const setUserSavedPortfolios = (portfolios: any[]) =>
    dispatch({ type: "SET_USER_SAVED_PORTFOLIOS", payload: portfolios });

  const setCompareSavedPortfolios = (portfolios: any[]) =>
    dispatch({ type: "SET_COMPARE_SAVED_PORTFOLIOS", payload: portfolios });

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
        setShowSavePortfolioNameModal,
        setShowSavedPortolioModal,
        setShowCompareSavedPortfolioModal,
        setIsCustomTimePeriod,
        setStartDate,
        setEndDate,
        setSelectedTimePeriod,
        setModalContent,
        setUserSavedPortfolios,
        setCompareSavedPortfolios,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => useContext(PortfolioContext);
