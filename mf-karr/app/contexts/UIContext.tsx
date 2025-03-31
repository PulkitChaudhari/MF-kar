"use client";
import React, { createContext, useContext, useState } from "react";
import { parseDate } from "@internationalized/date";

// Define the context type
type UIContextType = {
  isLoading: boolean;
  showSavePortfolioNameModal: boolean;
  showSavedPortolioModal: boolean;
  showCompareSavedPortfolioModal: boolean;
  isCustomTimePeriod: boolean;
  startDate: any;
  endDate: any;
  selectedTimePeriod: string;
  modalContent: string;
  userSavedPortfolios: any[];
  compareSavedPortfolios: any[];

  // UI actions
  setIsLoading: (value: boolean) => void;
  setShowSavePortfolioNameModal: (value: boolean) => void;
  setShowSavedPortolioModal: (value: boolean) => void;
  setShowCompareSavedPortfolioModal: (value: boolean) => void;
  setIsCustomTimePeriod: (value: boolean) => void;
  setStartDate: (date: any) => void;
  setEndDate: (date: any) => void;
  setSelectedTimePeriod: (period: string) => void;
  setModalContent: (content: string) => void;
  setUserSavedPortfolios: (portfolios: any[]) => void;
  setCompareSavedPortfolios: (portfolios: any[]) => void;
};

// Create the context with default values
const UIContext = createContext<UIContextType>({
  isLoading: false,
  showSavePortfolioNameModal: false,
  showSavedPortolioModal: false,
  showCompareSavedPortfolioModal: false,
  isCustomTimePeriod: false,
  startDate: parseDate("2024-04-04"),
  endDate: parseDate("2024-04-04"),
  selectedTimePeriod: "1",
  modalContent: "",
  userSavedPortfolios: [],
  compareSavedPortfolios: [],

  // Default functions (will be overridden by provider)
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSavePortfolioNameModal, setShowSavePortfolioNameModal] =
    useState<boolean>(false);
  const [showSavedPortolioModal, setShowSavedPortolioModal] =
    useState<boolean>(false);
  const [showCompareSavedPortfolioModal, setShowCompareSavedPortfolioModal] =
    useState<boolean>(false);
  const [isCustomTimePeriod, setIsCustomTimePeriod] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<any>(parseDate("2024-04-04"));
  const [endDate, setEndDate] = useState<any>(parseDate("2024-04-04"));
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("1");
  const [modalContent, setModalContent] = useState<string>("");
  const [userSavedPortfolios, setUserSavedPortfolios] = useState<any[]>([]);
  const [compareSavedPortfolios, setCompareSavedPortfolios] = useState<any[]>(
    []
  );

  return (
    <UIContext.Provider
      value={{
        isLoading,
        showSavePortfolioNameModal,
        showSavedPortolioModal,
        showCompareSavedPortfolioModal,
        isCustomTimePeriod,
        startDate,
        endDate,
        selectedTimePeriod,
        modalContent,
        userSavedPortfolios,
        compareSavedPortfolios,
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
