export interface tableRow {
  schemeName: string;
  schemeCode: number;
  cagr: string;
  weightage: number;
}

export interface tableColumn {
  label: string;
  key: string;
  width: string;
}

export interface apiResponse {
  meta: any;
  data: apiNavData[];
  status: string;
}

export interface apiNavData {
  date: string;
  nav: string;
}

export type PortfolioState = {
  selectedInstrumentsData: any;
  isAdjustWeightageEnabled: boolean;
  portfolioName: string;
  isSaveButtonEnabled: boolean;
  toBeData: any[];
  tableDataWeightageCopy: any[];
  isEditPortfolioName: boolean;
  initialAmount: string;
  investmentMode: string;
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
};

export type PortfolioContextType = PortfolioState & {
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
  setInitialAmount: (amount: string) => void;
  setInvestmentMode: (mode: any) => void;
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

// Define the context type
export type BacktestContextType = {
  chartData: any[];
  maxDrawdown: number;
  sharpeRatio: number;
  initialValue: number;
  finalValue: number;
  selectedCompareIndex: string;
  portfolioMetrics: any[];
  comparePortfolioReturnDiff: number;
  isEditFunds: boolean;
  showCompareSavedPortfolioModal: boolean;
  compareSavedPortfolios: any[];
  selectedTimePeriod: string;
  // Backtest actions
  setShowCompareSavedPortfolioModal: (flag: boolean) => void;
  backtestPortfolio: (
    selectedInstrumentsData: any,
    selectedTimePeriod: number,
    initialAmount: number,
    investmentMode: string
  ) => Promise<void>;
  changeCompareIndex: (data: any, indexKey: any) => Promise<void>;
  loadComparePortfolio: (portfolio: any) => Promise<void>;
  setIsEditFunds: (value: boolean) => void;
  setSelectedTimePeriod: (timePeriod: string) => void;
};

export type UIContextType = {
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

export type ToastColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "foreground"
  | undefined;

export interface navData {
  date: Date;
  nav: string;
}
