import { tableColumn } from "./interfaces/interfaces";

export const columns: tableColumn[] = [
  {
    key: "instrumentName",
    label: "Instrument Name",
  },
  {
    key: "cagr",
    label: "1YR CAGR",
  },
  {
    key: "weightage",
    label: "Weightage",
  },
  { label: "Actions", key: "actions" },
];

export const cagrValues: tableColumn[] = [
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
