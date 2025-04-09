"use client";
import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { parseDate } from "@internationalized/date";
import { UIContextType } from "../interfaces/interfaces";

// Default values
const DEFAULT_DATE = parseDate("2024-04-04");
const DEFAULT_TIME_PERIOD = "1";

// Initial state
const initialState: Omit<
  UIContextType,
  | "setIsLoading"
  | "setShowSavePortfolioNameModal"
  | "setShowSavedPortolioModal"
  | "setShowCompareSavedPortfolioModal"
  | "setIsCustomTimePeriod"
  | "setStartDate"
  | "setEndDate"
  | "setSelectedTimePeriod"
  | "setModalContent"
  | "setUserSavedPortfolios"
  | "setCompareSavedPortfolios"
> = {
  isLoading: false,
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
  | { type: "SET_LOADING"; payload: boolean }
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
function uiReducer(
  state: typeof initialState,
  action: ActionType
): typeof initialState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
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

const UIContext = createContext<UIContextType>({
  ...initialState,
  setIsLoading: () => {},
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

// Provider component
export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Create setter functions that use dispatch
  const setIsLoading = (value: boolean) =>
    dispatch({ type: "SET_LOADING", payload: value });

  const setShowSavePortfolioNameModal = (value: boolean) =>
    dispatch({ type: "SET_SAVE_PORTFOLIO_MODAL", payload: value });

  const setShowSavedPortolioModal = (value: boolean) =>
    dispatch({ type: "SET_SAVED_PORTFOLIO_MODAL", payload: value });

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

  return (
    <UIContext.Provider
      value={{
        ...state,
        setIsLoading,
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
    </UIContext.Provider>
  );
};

// Custom hook to use the UI context
export const useUIContext = () => useContext(UIContext);
