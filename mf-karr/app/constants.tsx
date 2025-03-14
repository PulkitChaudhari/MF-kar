import { tableColumn } from "./interfaces/interfaces";

export const columns: any[] = [
  {
    key: "instrumentName",
    label: "Instrument Name",
    width: "40%",
  },
  {
    key: "cagr",
    label: "1YR CAGR",
    width: "15%",
  },
  {
    key: "weightage",
    label: "Weightage",
    width: "30%",
  },
  { label: "Actions", key: "actions", width: "15%" },
];

export const cagrValues: any[] = [
  {
    key: "1",
    label: "1Y",
  },
  {
    key: "3",
    label: "3Y",
  },
  {
    key: "5",
    label: "5Y",
  },
  {
    key: "10",
    label: "10Y",
  },
];

export const compareIndexValues: any[] = [
  {
    label: "Nifty 50",
    key: "nifty_50",
  },
  {
    label: "Saved Portfolios",
    key: "saved_portfolios",
  },
];

export const monthMapping: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
