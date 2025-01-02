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
import MFund from "./interfaces";
import { partialMfData } from "./partialMfData";
import { IconSvgProps } from "@/types";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export default function PortfolioChart({ chartData }: { chartData: any }) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartIndexOptions = [{ value: "nifty50", label: "Nifty 50" }];

  const [finalChartData, setFinalChartData] = useState<any[]>([]);

  const chartData1 = useState<any[]>([
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "June", desktop: 214, mobile: 140 },
  ]);

  useEffect(() => {
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
          console.log(currentDate);
          if (myMap[currentDate] === undefined)
            myMap[currentDate] = [currentDate];
          else
            myMap[currentDate] =
              myMap[currentDate] + schemeDataAsObj[currentDate];
        }
      });

      const tempChartData: any[] = [];
      let firstValue = 1;
      Object.keys(myMap).forEach((key) => {
        tempChartData.push({
          date: key,
          nav: myMap[key],
        });
        // if (firstValue == 1) {
        //   (firstValue = myMap[key]), (tempChartData[0].nav = 1);
        // }
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
        {/* <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer> */}

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
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
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
                  //   tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                {/* <Area
                  dataKey="mobile"
                  type="natural"
                  fill="var(--color-mobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                  stackId="a"
                /> */}
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
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
