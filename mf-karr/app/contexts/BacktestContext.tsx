"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { apiService } from "../services/api.service";

// Define the context type
type BacktestContextType = {
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
  // Backtest actions
  setShowCompareSavedPortfolioModal: (flag: boolean) => void;
  backtestPortfolio: (
    selectedInstrumentsData: any,
    selectedTimePeriod: number,
    initialAmount: number,
    investmentMode: string
  ) => Promise<void>;
  changeCompareIndex: (data: any, indexKey: string) => Promise<void>;
  loadComparePortfolio: (portfolio: any) => Promise<void>;
  setIsEditFunds: (value: boolean) => void;
  setSelectedTimePeriod: (timePeriod: string) => void;
};

// Create the context with default values
const BacktestContext = createContext<BacktestContextType>({
  chartData: [],
  maxDrawdown: 0,
  sharpeRatio: 0,
  initialValue: 100,
  finalValue: 100,
  selectedCompareIndex: "Nifty 50",
  portfolioMetrics: [],
  comparePortfolioReturnDiff: 0,
  isEditFunds: true,
  showCompareSavedPortfolioModal: false,
  compareSavedPortfolios: [],
  setShowCompareSavedPortfolioModal: async () => {},
  // Default functions (will be overridden by provider)
  backtestPortfolio: async () => {},
  changeCompareIndex: async () => {},
  loadComparePortfolio: async () => {},
  setIsEditFunds: () => {},
  setSelectedTimePeriod: () => {},
});

// Provider component
export const BacktestProvider = ({
  children,
  selectedTimePeriodState,
  initialAmountState,
  investmentModeState,
}: {
  children: React.ReactNode;
  selectedTimePeriodState: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ];
  initialAmountState: [string, React.Dispatch<React.SetStateAction<string>>];
  investmentModeState: [any, React.Dispatch<React.SetStateAction<any>>];
}) => {
  // Extract state and setState from props
  const [selectedTimePeriod, setSelectedTimePeriod] = selectedTimePeriodState;
  const [initialAmount, setInitialAmount] = initialAmountState;
  const [investmentMode, setInvestmentMode] = investmentModeState;

  // State for backtest results
  const [chartData, setChartData] = useState<any[]>([]);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);
  const [sharpeRatio, setSharpeRatio] = useState<number>(0);
  const [initialValue, setInitialValue] = useState(100);
  const [finalValue, setFinalValue] = useState(100);
  const [selectedCompareIndex, setSelectedCompareIndex] =
    useState<string>("Nifty 50");
  const [portfolioMetrics, setPortfolioMetrics] = useState<any[]>([]);
  const [comparePortfolioReturnDiff, setComparePortfolioReturnDiff] =
    useState<any>(0);
  const [isEditFunds, setIsEditFunds] = useState<boolean>(true);
  const [showCompareSavedPortfolioModal, setShowCompareSavedPortfolioModal] =
    useState<boolean>(false);
  const [compareSavedPortfolios, setCompareSavedPortfolios] = useState<any[]>(
    []
  );

  // Use useRef to track previous value
  const prevInitialAmountRef = useRef<string>();
  useEffect(() => {
    prevInitialAmountRef.current = initialAmount;
  }, [initialAmount]);
  const oldInitialAmount = prevInitialAmountRef.current;

  // Function to backtest portfolio
  const backtestPortfolio = async (
    selectedInstrumentsData: any,
    selectedTimePeriod: number,
    initialAmount: number,
    investmentMode: string
  ) => {
    try {
      const data = await apiService.analyzePortfolio(
        selectedInstrumentsData,
        selectedTimePeriod,
        initialAmount,
        investmentMode
      );

      setMaxDrawdown(data.metrics.maxDrawdown);
      setSharpeRatio(data.metrics.sharpeRatio);
      setInitialValue(data.metrics.initialValue);
      setFinalValue(data.metrics.finalValue);
      setIsEditFunds(false);

      await changeCompareIndex(data, "nifty_50");
      return data;
    } catch (error) {
      console.error("Error fetching portfolio analysis:", error);
    }
  };

  // Function to fetch index comparison data
  const fetchIndexComparison = async (data: any, indexName: string) => {
    try {
      const indexData = await apiService.compareIndex(
        indexName,
        Number(selectedTimePeriod),
        Number(initialAmount),
        investmentMode.toString()
      );

      let chartData = data;
      if (data["chartData"] != null) chartData = data.chartData;

      let metrics =
        data["metrics"] != null
          ? data.metrics
          : {
              maxDrawdown: "-1",
              sharpeRatio: "-1",
              initialAmount: "-1",
              finalValue: "-1",
            };

      // Merge index data with portfolio data
      const updatedChartData = chartData.map((item: any, index: any) => ({
        ...item,
        navIndex: indexData.chartData[index]?.nav || 0,
      }));

      const tempPortfolioMetrics = [];
      tempPortfolioMetrics.push({
        name: "Your Portfolio",
        maxDrawdown: metrics.maxDrawdown,
        sharpeRatio: metrics.sharpeRatio,
        initialAmount: metrics.initialValue,
        finalValue: metrics.finalValue,
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

      console.log(
        updatedChartData[updatedChartData.length - 1].nav -
          updatedChartData[updatedChartData.length - 1].navIndex
      );

      setComparePortfolioReturnDiff(
        updatedChartData[updatedChartData.length - 1].nav -
          updatedChartData[updatedChartData.length - 1].navIndex
      );

      setPortfolioMetrics(tempPortfolioMetrics);
      setChartData(updatedChartData);
    } catch (error) {
      console.error("Error fetching index comparison:", error);
    }
  };

  // Function to change compare index
  const changeCompareIndex = async (data: any, indexKey: any) => {
    if (indexKey === "nifty_50") {
      await fetchIndexComparison(data, indexKey);
      setSelectedCompareIndex("Nifty 50");
    } else if (indexKey === "saved_portfolios") {
      openComparePortfolioModal();
    }
  };

  // Function to open compare portfolio modal
  const openComparePortfolioModal = () => {
    fetchSavedPortfolio().then((res) => {
      let tempPortfolios: any[] = [];
      res.forEach((portfolio: any) => {
        tempPortfolios.push({
          portfolioName: portfolio[2],
          instruments: JSON.parse(portfolio[1]),
        });
      });
      setCompareSavedPortfolios(tempPortfolios);
      console.log(tempPortfolios);
      setShowCompareSavedPortfolioModal(true);
    });
  };

  // Function to fetch saved portfolio
  const fetchSavedPortfolio = async () => {
    const session = await import("next-auth/react").then((mod) =>
      mod.getSession()
    );
    if (session?.user?.email) {
      return apiService.getPortfolios(session.user.email);
    }
    return Promise.resolve([]);
  };

  // Function to load compare portfolio
  const loadComparePortfolio = async (row: any) => {
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

      console.log(portfolioData);

      setComparePortfolioReturnDiff(
        updatedChartData[updatedChartData.length - 1].nav -
          updatedChartData[updatedChartData.length - 1].navIndex
      );

      setChartData(updatedChartData);
      setSelectedCompareIndex("Saved Portfolios");
      setShowCompareSavedPortfolioModal(false);
    } catch (error) {
      console.error("Error loading portfolio for comparison:", error);
    }
  };

  return (
    <BacktestContext.Provider
      value={{
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
        setShowCompareSavedPortfolioModal,
        backtestPortfolio,
        changeCompareIndex,
        loadComparePortfolio,
        setIsEditFunds,
        setSelectedTimePeriod,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
};

// Custom hook to use the backtest context
export const useBacktestContext = () => useContext(BacktestContext);
