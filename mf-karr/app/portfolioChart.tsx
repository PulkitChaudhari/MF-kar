"use client";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
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
import { compareIndexValues } from "./constants";
import { config } from "../config/config";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { apiResponse } from "./interfaces/interfaces";
import { useSession } from "next-auth/react";
import { apiService } from "./services/api.service";

export default function PortfolioChart({
  chartData,
  maxDrawdown,
  sharpeRatio,
  initialValue,
  finalValue,
  changeCompareIndex,
  selectedCompareIndex,
  loadComparePortfolio,
  showCompareSavedPortfolioModal,
  setShowCompareSavedPortfolioModal,
  compareSavedPortfolios,
  isLoading,
}: {
  initialAmount: String;
  oldInitialNum: String;
  investmentMode: String;
  chartData: any[];
  maxDrawdown: number;
  sharpeRatio: number;
  initialValue: number;
  finalValue: number;
  changeCompareIndex: any;
  selectedCompareIndex: any;
  loadComparePortfolio: any;
  showCompareSavedPortfolioModal: any;
  setShowCompareSavedPortfolioModal: any;
  compareSavedPortfolios: any;
  isLoading: any;
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

  return (
    <div className="flex gap-10 flex-col">
      <Modal
        isDismissable={true}
        isKeyboardDismissDisabled={true}
        isOpen={showCompareSavedPortfolioModal}
        hideCloseButton={false}
        className="p-2"
        onClose={() => setShowCompareSavedPortfolioModal(false)}
      >
        <ModalContent className="w-full">
          <ModalBody className="w-full">
            {compareSavedPortfolios.map((row: any) => {
              return (
                <div key={row.portfolioName} className="flex p-2 m-1">
                  <div className="col-span-4 flex align-center justify-between p-2">
                    <div className="text-sm flex items-center">
                      {row?.portfolioName}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="bordered"
                        className="hover:bg-green-200 transition-all"
                        onPress={() => loadComparePortfolio(row)}
                        type="submit"
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        isIconOnly
                        variant="bordered"
                        className="hover:bg-red-200 transition-all"
                      >
                        <RxCross2 />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </ModalBody>
          <ModalFooter className="w-full pt-0"></ModalFooter>
        </ModalContent>
      </Modal>
      <div>
        <div>
          <div>
            <div className="flex flex-row sm:flex-col w-full gap-1">
              <div className="flex w-full gap-2 flex-col">
                <div className="flex items-center gap-5">
                  <b className="text-lg">Portfolio Returns</b>
                  <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col w-1/3">
                    <div>Invested Amount</div> <div>₹ {initialValue}</div>
                  </div>
                  <div className="flex flex-col w-1/3">
                    <div>Final Amount</div> <div>₹ {finalValue}</div>
                  </div>
                  {finalValue < initialValue ? (
                    <div className="flex flex-col w-1/3">
                      <div>Loss</div>
                      <div>
                        {(((finalValue - initialValue) / 100) * 100).toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col w-1/3">
                      <div>Gain</div>
                      <div>
                        {(
                          ((finalValue - initialValue) / initialValue) *
                          100
                        ).toFixed(2)}{" "}
                        %
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col w-1/3">
                    <div>Max Drawdown</div>
                    <div>{maxDrawdown.toFixed(2)}%</div>
                  </div>
                  <div className="flex flex-col w-1/3">
                    <div>Sharpe Ratio</div>
                    <div>{sharpeRatio.toFixed(2)}</div>
                  </div>
                  <div className="flex flex-col w-1/3">
                    <div>XIRR</div>
                    <div>{sharpeRatio.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div>
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
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <b className="text-lg">Compare Returns</b>
        <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
      </div>
      <div>
        <div>
          <div>
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
          </div>
          <div>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
