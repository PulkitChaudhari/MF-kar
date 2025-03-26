"use client";
import React from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableColumn,
  TableHeader,
} from "@nextui-org/react";

import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@nextui-org/button";
import { compareIndexValues } from "./constants";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";

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
  portfolioMetrics,
  comparePortfolioReturnDiff,
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
  portfolioMetrics: any[];
  comparePortfolioReturnDiff: any;
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
    <div className="flex gap-[5rem] flex-col p-2">
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
      <div className="flex flex-col gap-[2rem]">
        <div>
          <div className="flex flex-row sm:flex-col w-full gap-1">
            <div className="flex items-center gap-3 mb-5">
              <b className="text-lg">Portfolio Returns</b>
              <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
            </div>
            <div className="flex w-full gap-10 flex-col items-center">
              <div className="w-11/12 gap-7 flex flex-col">
                <div className="flex gap-2">
                  <div className="flex flex-col w-1/3">
                    <div>Invested Amount</div> <div>₹ {initialValue}</div>
                  </div>
                  <div className="flex flex-col w-1/3">
                    <div>Final Amount</div>{" "}
                    <div
                      className={
                        finalValue > initialValue
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ₹ {finalValue}
                    </div>
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
                      <div
                        className={
                          finalValue > initialValue
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
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
                    <div className="text-red-400">
                      - {maxDrawdown.toFixed(2)}%
                    </div>
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
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              Loading chart data...
            </div>
          ) : (
            <div className="w-11/12">
              <ChartContainer config={chartConfig}>
                <AreaChart
                  // accessibilityLayer
                  // data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                  // width={width}
                  // height={height}
                  data={chartData}
                  // margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                    domain={[0, "dataMax + 80"]}
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

                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="nav"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    dot={false}
                    // stackId="2"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[2rem] mb-10">
        <div className="flex items-center gap-3">
          <b className="text-lg">Compare Returns with</b>
          <div className="flex">
            <Dropdown id="line-graph">
              <DropdownTrigger>
                <Button variant="bordered">{selectedCompareIndex}</Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => changeCompareIndex(chartData, key)}
                aria-label="Compare Index Actions"
                items={compareIndexValues}
              >
                {(item) => (
                  <DropdownItem key={item.key}>{item.label}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="h-[1px] bg-gray-300 dark:bg-gray-600 flex-grow"></div>
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex gap-1">
            {/* <b
              className={
                chartData[chartData.length - 1].navIndex >
                chartData[chartData.length - 1].nav
                  ? "text-green-400 text-lg"
                  : "text-red-400 text-lg"
              }
            >
              {(
                ((chartData[chartData.length - 1].navIndex >
                chartData[chartData.length - 1].nav
                  ? chartData[chartData.length - 1].navIndex -
                    chartData[chartData.length - 1].nav
                  : chartData[chartData.length - 1].nav -
                    chartData[chartData.length - 1].navIndex) /
                  chartData[chartData.length - 1].nav) *
                100
              ).toFixed(2)}
              %
            </b> */}
            {comparePortfolioReturnDiff < 0 ? (
              <b className="text-red-400 text-lg">
                {comparePortfolioReturnDiff.toFixed(2)}% lower compared to{" "}
                {selectedCompareIndex}
              </b>
            ) : (
              <b className="text-green-400 text-lg">
                {comparePortfolioReturnDiff.toFixed(2)}% higher compared to{" "}
                {selectedCompareIndex}
              </b>
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              Loading comparison data...
            </div>
          ) : (
            <div className="w-11/12">
              <ChartContainer config={chartConfig}>
                <AreaChart
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
                  {/* <YAxis
                    dataKey="nav"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={["dataMin", 500]}
                  /> */}
                  <YAxis
                    dataKey="navIndex"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, "dataMax + 40"]}
                  />
                  <YAxis
                    dataKey="nav"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, "dataMax + 40"]}
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

                  <defs>
                    <linearGradient
                      id="fillDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>

                  <Area
                    dataKey="nav"
                    type="monotone"
                    stroke="var(--color-desktop)"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    dot={false}
                    stackId="1"
                  />
                  <Area
                    dataKey="navIndex"
                    type="monotone"
                    stroke="var(--color-mobile)"
                    fill="url(#fillMobile)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    dot={false}
                    // stackId="2"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
          <div className="w-11/12">
            <Table isStriped aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>{""}</TableColumn>
                <TableColumn>Final Value</TableColumn>
                <TableColumn>Gain</TableColumn>
                <TableColumn>Max Drawdown</TableColumn>
                <TableColumn>Sharpe Ratio</TableColumn>
                <TableColumn>XIRR</TableColumn>
              </TableHeader>
              <TableBody>
                {portfolioMetrics.map((metric) => {
                  return (
                    <TableRow key={metric.name}>
                      <TableCell>{metric.name}</TableCell>
                      <TableCell>{metric.finalValue}</TableCell>
                      <TableCell>{metric.gain}</TableCell>
                      <TableCell>{metric.maxDrawdown}</TableCell>
                      <TableCell>{metric.sharpeRatio}</TableCell>
                      <TableCell>{metric.xirr}</TableCell>
                    </TableRow>
                  );
                })}
                {/* <TableRow key="1">
                  <TableCell>Tony Reichert</TableCell>
                  <TableCell>CEO</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Tony Reichert</TableCell>
                  <TableCell>CEO</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
