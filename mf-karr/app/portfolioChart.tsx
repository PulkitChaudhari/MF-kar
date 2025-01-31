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

import { TrendingDown, TrendingUp } from "lucide-react";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@nextui-org/button";
import { monthMapping } from "./constants";

export default function PortfolioChart({
  instrumentsData,
  timePeriod,
}: {
  instrumentsData: any;
  timePeriod: Number;
}) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const [portfolioReturn, setPortfolioReturn] = useState<Number>(0);

  const [chartData, setChartData] = useState<any[]>([]);

  function formatDate(date: string) {
    const tempDate = new Date(date);
    return (
      tempDate.getDate() +
      " " +
      monthMapping[tempDate.getMonth()] +
      ", " +
      tempDate.getFullYear()
    );
  }

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
          nav: myMap[key] === undefined ? 0 : Number(myMap[key].toFixed(2)),
        });
      });
      const tempPortfolioReturn =
        tempChartData[tempChartData.length - 1].nav - 100;
      setPortfolioReturn(Math.max(tempPortfolioReturn, 0));
      setChartData(tempChartData);
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
      <div className="mx-10 my-10">
        {/* {chartData !== undefined ? chartData["120828"][0].date : "nope"} */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              Portfolio returns chart
              {/* <Autocomplete
                defaultItems={chartIndexOptions}
                listboxProps={{
                  emptyContent: "Your own empty content text.",
                }}
                menuTrigger="input"
                label="Select Index"
                className="w-3/4"
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete> */}
              {/* <div className="flex items-center space-x-2">
                <Label className="w-min">Line Graph</Label>
                <Switch
                  id="line-graph"
                  onClick={() => setShowLineChart(!showLineChart)}
                />
                <Label className="w-min" htmlFor="line-graph">
                  Area Graph
                </Label>
              </div> */}
            </CardTitle>
            {/* <CardDescription>
              Show the performance of your portfolio compared to
            </CardDescription> */}
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
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by {portfolioReturn.toFixed(2)}%
                  {Number(portfolioReturn.toFixed(2)) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
