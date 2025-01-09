"use client";
import React, { useEffect, useState } from "react";
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

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@nextui-org/button";
import { monthMapping } from "./constants";

export default function PortfolioChart({ chartData }: { chartData: any }) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartData1 = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const chartConfig1 = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const chartIndexOptions = [{ value: "nifty50", label: "Nifty 50" }];

  const [finalChartData, setFinalChartData] = useState<any[]>([]);

  const [showLineChart, setShowLineChart] = useState<boolean>(true);

  function formatDate(date: string) {
    const tempDate = new Date(date);
    console.log(tempDate);
    return (
      tempDate.getDay() +
      " " +
      monthMapping[tempDate.getMonth()] +
      ", " +
      tempDate.getFullYear()
    );
  }

  useEffect(() => {
    console.log(chartData);
    if (chartData !== undefined) {
      let myMap: any = {};
      const dateArray: any[] = generateDateArray();
      for (let idx = 0; idx < dateArray.length; idx++) {
        const currentDate = dateArray[idx];
        myMap[currentDate] = undefined;
      }
      Object.keys(chartData).map((key) => {
        const schemeCodeData: any[] = chartData[key];

        const schemeDataAsObj: any = {};
        schemeCodeData.forEach((data) => {
          schemeDataAsObj[data.date] = data.nav;
        });

        for (let idx = 0; idx < dateArray.length; idx++) {
          const currentDate = dateArray[idx];
          if (schemeDataAsObj[currentDate] === undefined && idx - 1 >= 0) {
            schemeDataAsObj[currentDate] = schemeDataAsObj[dateArray[idx - 1]];
          }
        }

        for (let idx = 0; idx < dateArray.length; idx++) {
          const currentDate = dateArray[idx];
          if (myMap[currentDate] === undefined)
            myMap[currentDate] = schemeDataAsObj[currentDate];
          else
            myMap[currentDate] =
              myMap[currentDate] + schemeDataAsObj[currentDate];
        }
      });

      const tempChartData: any[] = [];
      Object.keys(myMap).forEach((key) => {
        tempChartData.push({
          date: formatDate(key),
          nav: myMap[key] === undefined ? 0 : myMap[key],
        });
      });
      setFinalChartData(tempChartData);
    }
  }, [chartData]);

  function generateDateArray(): Date[] {
    let tempDate = new Date();
    let todayDate = new Date(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate()
    );
    let thresholdDate = new Date(
      tempDate.getFullYear() - 1,
      tempDate.getMonth(),
      tempDate.getDate()
    );
    let dateArray: Date[] = [];
    while (todayDate > thresholdDate) {
      let tempDate = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
      );
      dateArray.push(tempDate);
      todayDate.setDate(todayDate.getDate() - 1);
    }
    dateArray = dateArray.reverse();
    return dateArray;
  }

  return (
    <div className="flex gap-2 flex-col">
      <div className="mx-10 my-10">
        {/* {chartData !== undefined ? chartData["120828"][0].date : "nope"} */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              Portfolio returns compared to
              <Autocomplete
                defaultItems={chartIndexOptions}
                listboxProps={{
                  emptyContent: "Your own empty content text.",
                }}
                menuTrigger="input"
                placeholder="Search an animal"
                label="Select Index"
                className="w-3/4"
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <div className="flex items-center space-x-2">
                <Label className="w-min">Line Graph</Label>
                <Switch
                  id="line-graph"
                  onClick={() => setShowLineChart(!showLineChart)}
                />
                <Label className="w-min" htmlFor="line-graph">
                  Area Graph
                </Label>
              </div>
            </CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          {showLineChart ? (
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={finalChartData}
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
            </CardContent>
          ) : (
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={finalChartData}
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
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="nav"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          )}
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
