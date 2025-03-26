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
