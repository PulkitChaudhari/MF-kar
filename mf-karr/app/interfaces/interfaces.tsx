export interface tableRow {
  schemeName: string;
  schemeCode: number;
  cagr: string;
  weightage: number;
}

export interface tableColumn {
  label: string;
  key: string;
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

export interface navData {
  date: Date;
  nav: string;
}
