"use client";
import React from "react";
import { Input } from "@nextui-org/react";
import { MdModeEditOutline } from "../app/icons";

export default function PortfolioNameComponent({
  isEditPortfolioName,
  portfolioName,
  setIsEditPortfolioName,
  setPortfolioName,
}: {
  isEditPortfolioName: any;
  portfolioName: any;
  setPortfolioName: any;
  setIsEditPortfolioName: any;
}) {
  return (
    <div className="w-1/2">
      <div className="group cursor-pointer">
        <div
          className={
            isEditPortfolioName
              ? "flex gap-2 items-center w-full h-full"
              : "pb-[5px] h-full w-full flex gap-2 items-center text-sm border-b-2 border-transparent group-hover:border-dotted group-hover:border-current"
          }
        >
          {isEditPortfolioName ? (
            <Input
              type="text"
              variant="underlined"
              value={portfolioName}
              onFocusChange={(eve) => {
                setIsEditPortfolioName(eve);
              }}
              size="sm"
              className="h-full"
              autoFocus={isEditPortfolioName}
              onValueChange={setPortfolioName}
            />
          ) : (
            <div
              onClick={() => setIsEditPortfolioName(true)}
              className="flex gap-2 w-full items-center overflow-hidden"
            >
              <p className="grow text-sm whitespace-nowrap overflow-ellipsis overflow-hidden">
                {portfolioName}
              </p>
              <MdModeEditOutline />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
