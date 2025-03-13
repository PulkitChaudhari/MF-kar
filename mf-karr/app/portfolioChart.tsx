"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
} from "@nextui-org/react";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@nextui-org/button";
import { monthMapping } from "./constants";
import { config } from "../config/config";
import { apiResponse } from "./interfaces/interfaces";

export default function PortfolioChart({
  instrumentsData,
  timePeriod,
  initialAmount,
  oldInitialNum,
}: {
  instrumentsData: any;
  timePeriod: Number;
  initialAmount: String;
  oldInitialNum: String;
}) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [portfolioReturn, setPortfolioReturn] = useState<Number>(0);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);
  const [sharpeRatio, setSharpeRatio] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [indexData, setIndexData] = useState<any[]>([]);
  const [initialValue, setInitialValue] = useState(100);
  const [finalValue, setFinalValue] = useState(100);

  function calculateMaxDrawdown(data: any[]): number {
    if (!data || data.length === 0) return 0;

    let peak = data[0].nav;
    let maxDrawdown = 0;

    for (let i = 1; i < data.length; i++) {
      const currentValue = data[i].nav;

      if (currentValue > peak) {
        peak = currentValue;
      } else if (peak > 0) {
        const drawdown = ((peak - currentValue) / peak) * 100;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    }

    return maxDrawdown;
  }

  async function fetchIndexData(
    indexName: any,
    timePeriod: any
  ): Promise<apiResponse> {
    return await fetch(config.apiUrl + `/api/index`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        indexCode: "nifty_50",
        timePeriod: timePeriod,
      }),
    }).then(async (resp) => {
      return await resp.json().then((apiData: apiResponse) => {
        return apiData;
      });
    });
  }

  function calculateSharpeRatio(data: any[]): number {
    if (!data || data.length < 2) return 0;

    // Calculate daily returns
    const returns: number[] = [];
    for (let i = 1; i < data.length; i++) {
      const dailyReturn = (data[i].nav - data[i - 1].nav) / data[i - 1].nav;
      returns.push(dailyReturn);
    }

    // Calculate average return
    const avgReturn =
      returns.reduce((sum, value) => sum + value, 0) / returns.length;

    // Calculate standard deviation (volatility)
    const squaredDiffs = returns.map((value) => Math.pow(value - avgReturn, 2));
    const variance =
      squaredDiffs.reduce((sum, value) => sum + value, 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    // Assume a risk-free rate of 3% annually, converted to same period as returns
    // For daily returns, approximate daily risk-free rate
    const annualRiskFreeRate = 0.03;
    const periodRiskFreeRate = annualRiskFreeRate / 252; // Assuming ~252 trading days

    // Calculate Sharpe ratio
    if (stdDev === 0) return 0; // Avoid division by zero
    const sharpeRatio = (avgReturn - periodRiskFreeRate) / stdDev;

    // Annualize the Sharpe ratio
    const annualizedSharpeRatio = sharpeRatio * Math.sqrt(252);

    return annualizedSharpeRatio;
  }

  function formatDate(date: string) {
    const tempDate = new Date(date);
    return (
      monthMapping[tempDate.getMonth()] +
      " " +
      tempDate.getFullYear().toString().substring(2)
    );
  }

  function getNAVsForRange(apiData: any, timePeriod: Number): any[] {
    const firstVal = apiData[0][1];
    let convertedData: any[] = [];

    for (let idx = apiData.length - 1; idx >= 0; idx--) {
      const nav = Number(apiData[idx][1]);
      const date = new Date(Date.parse(apiData[idx][0]));
      // if (date <= thresholdDate) break;
      convertedData.push({
        date: date.toString(),
        nav: (nav * 100) / firstVal,
      });
    }

    convertedData.reverse();
    return convertedData;
  }

  function calculateCAGR(navsForRange: any[], timePeriod: Number) {
    let vFinal = -1,
      vBegin = -1;

    if (navsForRange.length > 0) {
      vBegin = navsForRange[0].nav;
      vFinal = navsForRange[navsForRange.length - 1].nav;
    }
    return (
      (Math.pow(vFinal / vBegin, 1 / Number(timePeriod)) - 1) *
      100
    ).toFixed(2);
  }

  async function generateIndexData() {
    return await fetchIndexData("nifty_50", 1).then((resp: any) => {
      const navsForRange = getNAVsForRange(
        resp.nifty_50.indexData,
        Number(timePeriod)
      );

      const instrumentObj: any = {
        instrumentName: "Nifty 50",
        cagr: calculateCAGR(navsForRange, Number(timePeriod)),
        weightage: "",
        navData: navsForRange,
      };

      let myMap: any = {};

      const dateArray: any[] = generateDateArray(timePeriod);

      for (let idx = 0; idx < dateArray.length; idx++) {
        const currentDate = dateArray[idx];
        myMap[currentDate] = undefined;
      }

      // const instrumentData: any = instrumentsData[key];
      // const weightage = instrumentData.weightage;
      let unitsBought = 1;

      const schemeDataAsObj: any = {};
      navsForRange.forEach((data: any) => {
        schemeDataAsObj[data.date] = data.nav * unitsBought;
      });

      for (let idx = 0; idx < dateArray.length; idx++) {
        const currentDate = dateArray[idx];
        if (schemeDataAsObj[currentDate] === undefined && idx - 1 >= 0) {
          schemeDataAsObj[currentDate] = schemeDataAsObj[dateArray[idx - 1]];
        }
      }

      for (let idx = dateArray.length; idx >= 0; idx--) {
        const currentDate = dateArray[idx];
        if (
          schemeDataAsObj[currentDate] === undefined &&
          idx + 1 < dateArray.length
        ) {
          schemeDataAsObj[currentDate] = schemeDataAsObj[dateArray[idx + 1]];
        }
      }

      for (let idx = 0; idx < dateArray.length; idx++) {
        const currentDate = dateArray[idx];
        if (myMap[currentDate] === undefined) {
          if (navsForRange.length === 0) myMap[currentDate] = 100;
          else myMap[currentDate] = schemeDataAsObj[currentDate];
        } else {
          if (navsForRange.length === 0)
            myMap[currentDate] = myMap[currentDate] + 100;
          else
            myMap[currentDate] =
              myMap[currentDate] + schemeDataAsObj[currentDate];
        }
      }

      const tempChartData: any[] = [];
      Object.keys(myMap).forEach((key) => {
        tempChartData.push({
          date: formatDate(key),
          nav: myMap[key] === undefined ? 0 : Number(myMap[key].toFixed(2)),
        });
      });

      return tempChartData;
      // return instrumentObj;
    });
  }

  useEffect(() => {
    console.log(initialAmount, oldInitialNum);
    let tempChartData = chartData;
    tempChartData.forEach((data) => {
      data.nav = Number(
        ((data.nav * Number(initialAmount)) / Number(oldInitialNum)).toFixed(2)
      );
      data.navIndex = Number(
        (
          (data.navIndex * Number(initialAmount)) /
          Number(oldInitialNum)
        ).toFixed(2)
      );
    });
    setChartData(tempChartData);
  }, [initialAmount]);

  useEffect(() => {
    if (instrumentsData !== undefined) {
      let myMap: any = {};

      const dateArray: any[] = generateDateArray(timePeriod);

      for (let idx = 0; idx < dateArray.length; idx++) {
        const currentDate = dateArray[idx];
        myMap[currentDate] = undefined;
      }

      Object.keys(instrumentsData).map((key) => {
        const instrumentData: any = instrumentsData[key];
        const weightage = instrumentData.weightage;
        let unitsBought =
          instrumentData.navData.length > 0
            ? weightage / instrumentData.navData[0].nav
            : 0;

        const schemeDataAsObj: any = {};
        instrumentData.navData.forEach((data: any) => {
          schemeDataAsObj[data.date] = data.nav * unitsBought;
        });

        for (let idx = 0; idx < dateArray.length; idx++) {
          const currentDate = dateArray[idx];
          if (schemeDataAsObj[currentDate] === undefined && idx - 1 >= 0) {
            schemeDataAsObj[currentDate] = schemeDataAsObj[dateArray[idx - 1]];
          }
        }

        for (let idx = dateArray.length; idx >= 0; idx--) {
          const currentDate = dateArray[idx];
          if (
            schemeDataAsObj[currentDate] === undefined &&
            idx + 1 < dateArray.length
          ) {
            schemeDataAsObj[currentDate] = schemeDataAsObj[dateArray[idx + 1]];
          }
        }

        for (let idx = 0; idx < dateArray.length; idx++) {
          const currentDate = dateArray[idx];
          if (myMap[currentDate] === undefined) {
            if (instrumentData.navData.length === 0)
              myMap[currentDate] = weightage;
            else myMap[currentDate] = schemeDataAsObj[currentDate];
          } else {
            if (instrumentData.navData.length === 0)
              myMap[currentDate] = myMap[currentDate] + weightage;
            else
              myMap[currentDate] =
                myMap[currentDate] + schemeDataAsObj[currentDate];
          }
        }
      });

      const tempChartData: any[] = [];

      Object.keys(myMap).forEach((key) => {
        tempChartData.push({
          date: formatDate(key),
          // nav: myMap[key] === undefined ? 0 : Number(myMap[key].toFixed(2)),
          // actualDate: key,
          nav:
            myMap[key] === undefined
              ? 0
              : Number(((myMap[key] * Number(initialAmount)) / 100).toFixed(2)),
        });
      });
      const tempPortfolioReturn =
        tempChartData[tempChartData.length - 1].nav - 100;
      setPortfolioReturn(Math.max(tempPortfolioReturn, 0));
      setInitialValue(100);
      setFinalValue(tempChartData[tempChartData.length - 1].nav);
      generateIndexData().then((indexData) => {
        for (let i = 0; i < indexData.length; i++) {
          tempChartData[i].navIndex = Number(
            ((indexData[i].nav * Number(initialAmount)) / 100).toFixed(2)
          );
        }
        setChartData(tempChartData);
      });

      const calculatedMaxDrawdown = calculateMaxDrawdown(tempChartData);
      setMaxDrawdown(calculatedMaxDrawdown);

      const calculatedSharpeRatio = calculateSharpeRatio(tempChartData);
      setSharpeRatio(calculatedSharpeRatio);
    }
  }, [instrumentsData]);

  function generateDateArray(timePeriod: Number): Date[] {
    let tempDate = new Date();
    let todayDate = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate()
    );
    let thresholdDate = new Date(
      tempDate.getFullYear() - Number(timePeriod),
      tempDate.getMonth(),
      tempDate.getDate()
    );
    let dateArray: Date[] = [];
    while (todayDate > thresholdDate) {
      let tempDate = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate(),
        5,
        30,
        0,
        0
      );
      dateArray.push(tempDate);
      todayDate.setDate(todayDate.getDate() - 1);
    }
    dateArray = dateArray.reverse();
    return dateArray;
  }

  return (
    <div className="flex gap-2 flex-col">
      <div>
        {/* {chartData !== undefined ? chartData["120828"][0].date : "nope"} */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center w-full">
              <div className="flex flex-row sm:flex-col gap-1">
                <div className="flex gap-2">
                  <div className="flex flex-col justify-center items-center">
                    <div>Invested Amount</div> <div>{initialValue}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div>Final Amount</div> <div>{finalValue}</div>
                  </div>
                  {finalValue < initialValue ? (
                    <div className="flex flex-col items-center">
                      <div>Loss</div>
                      <div>
                        {(((finalValue - initialValue) / 100) * 100).toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div>Gain</div>
                      <div>
                        {(((finalValue - initialValue) / 100) * 100).toFixed(2)}{" "}
                        %
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <div>Max Drawdown</div>
                    <div>{maxDrawdown.toFixed(2)}%</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div>Sharpe Ratio</div>
                    <div>{sharpeRatio.toFixed(2)}</div>
                  </div>
                </div>
                <div></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="nav"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="nav"
                  type="monotone"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
                {/* <ChartLegend content={<ChartLegendContent />} /> */}
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2"></div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  dataKey="nav"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="nav"
                  type="monotone"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="navIndex"
                  type="monotone"
                  stroke="var(--color-mobile)"
                  strokeWidth={2}
                  dot={false}
                />
                {/* <ChartLegend content={<ChartLegendContent />} /> */}
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2"></div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
