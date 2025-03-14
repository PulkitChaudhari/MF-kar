"use client";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@nextui-org/button";
import { compareIndexValues, monthMapping } from "./constants";
import { config } from "../config/config";

export default function PortfolioChart({
  instrumentsData,
  timePeriod,
  initialAmount,
  oldInitialNum,
  investmentMode,
}: {
  instrumentsData: any;
  timePeriod: Number;
  initialAmount: String;
  oldInitialNum: String;
  investmentMode: String;
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

  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);
  const [sharpeRatio, setSharpeRatio] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [initialValue, setInitialValue] = useState(100);
  const [finalValue, setFinalValue] = useState(100);
  const [selectedCompareIndex, setSelectedCompareIndex] =
    useState("Saved Portfolios");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch portfolio analysis data from backend
  async function fetchPortfolioAnalysis() {
    setIsLoading(true);
    try {
      const response = await fetch(config.apiUrl + `/api/portfolio/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instrumentsData,
          timePeriod: Number(timePeriod),
          initialAmount: Number(initialAmount),
          investmentMode,
        }),
      });

      const data = await response.json();
      console.log(data);
      setChartData(data.chartData);
      setMaxDrawdown(data.metrics.maxDrawdown);
      setSharpeRatio(data.metrics.sharpeRatio);
      setInitialValue(data.metrics.initialValue);
      setFinalValue(data.metrics.finalValue);
    } catch (error) {
      console.error("Error fetching portfolio analysis:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch index comparison data
  async function fetchIndexComparison(indexName: string) {
    try {
      const response = await fetch(
        config.apiUrl + `/api/portfolio/compare-index`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            indexName,
            timePeriod: Number(timePeriod),
            initialAmount: Number(initialAmount),
            investmentMode,
          }),
        }
      );

      const indexData = await response.json();

      // Merge index data with portfolio data
      const updatedChartData = chartData.map((item, index) => ({
        ...item,
        navIndex: indexData.chartData[index]?.nav || 0,
      }));

      setChartData(updatedChartData);
    } catch (error) {
      console.error("Error fetching index comparison:", error);
    }
  }

  useEffect(() => {
    console.log(instrumentsData, timePeriod, investmentMode);
    if (
      instrumentsData !== undefined &&
      Object.keys(instrumentsData).length > 0
    ) {
      fetchPortfolioAnalysis();
    }
  }, [instrumentsData, timePeriod, investmentMode]);

  useEffect(() => {
    if (chartData.length > 0 && initialAmount !== oldInitialNum) {
      // Update chart data with new initial amount
      const scaleFactor = Number(initialAmount) / Number(oldInitialNum);
      const updatedChartData = chartData.map((data) => ({
        ...data,
        nav: Number((data.nav * scaleFactor).toFixed(2)),
        navIndex: data.navIndex
          ? Number((data.navIndex * scaleFactor).toFixed(2))
          : 0,
      }));

      setChartData(updatedChartData);
    }
  }, [initialAmount]);

  async function changeCompareIndex(indexKey: any) {
    if (indexKey === "nifty_50") {
      await fetchIndexComparison(indexKey);
      setSelectedCompareIndex("Nifty 50");
    } else {
      const updatedChartData = chartData.map((item) => ({
        ...item,
        navIndex: 0,
      }));
      setChartData(updatedChartData);
      setSelectedCompareIndex("Saved Portfolios");
    }
  }

  return (
    <div className="flex gap-2 flex-col">
      <div>
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                Loading chart data...
              </div>
            ) : (
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
                  />
                  <YAxis
                    dataKey="nav"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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
                </LineChart>
              </ChartContainer>
            )}
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
            <div className="flex justify-end">
              <Dropdown id="line-graph">
                <DropdownTrigger>
                  <Button variant="bordered">{selectedCompareIndex}</Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => changeCompareIndex(key)}
                  aria-label="Compare Index Actions"
                  items={compareIndexValues}
                >
                  {(item) => (
                    <DropdownItem key={item.key}>{item.label}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                Loading comparison data...
              </div>
            ) : (
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
                  />
                  <YAxis
                    dataKey="nav"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
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
                </LineChart>
              </ChartContainer>
            )}
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
