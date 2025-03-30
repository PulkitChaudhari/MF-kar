"use client";
import React from "react";
import { Button, Input } from "@nextui-org/react";
import { MdModeEditOutline } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { CiExport } from "react-icons/ci";
import { GiInjustice } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";

export default function PortfolioToolbarComponent({
  savePortfolio,
  isLoading,
  selectedInstrumentsData,
  openPortfolioModal,
  isAdjustWeightageEnabled,
  isSaveButtonEnabled,
  onSave,
  onCancelWeightAdjust,
  setIsAdjustWeightageEnabled,
}: {
  savePortfolio: any;
  isLoading: any;
  selectedInstrumentsData: any;
  openPortfolioModal: any;
  isAdjustWeightageEnabled: any;
  isSaveButtonEnabled: any;
  onSave: any;
  onCancelWeightAdjust: any;
  setIsAdjustWeightageEnabled: any;
}) {
  return (
    <div className="flex grow gap-2">
      <div className="flex gap-2">
        <Button
          isIconOnly
          variant="bordered"
          onPress={() => savePortfolio()}
          isDisabled={
            isLoading || Object.keys(selectedInstrumentsData).length === 0
          }
          size="sm"
        >
          <TfiSave />
        </Button>
        <Button
          isIconOnly
          variant="bordered"
          onPress={() => openPortfolioModal()}
          isDisabled={isLoading}
          size="sm"
        >
          <CiExport />
        </Button>
      </div>
      <div className="flex-1 ">
        {isAdjustWeightageEnabled ? (
          <div className="flex gap-2 w-full">
            <Button
              isIconOnly
              aria-label="Like"
              color="success"
              className="w-full"
              isDisabled={!isSaveButtonEnabled}
              onPress={() => onSave()}
              size="sm"
            >
              <FaCheck />
            </Button>
            <Button
              isIconOnly
              aria-label="Like1"
              color="danger"
              onPress={() => onCancelWeightAdjust()}
              size="sm"
              className="w-full"
            >
              <RxCross2 />
            </Button>
          </div>
        ) : (
          <Button
            isIconOnly
            variant="bordered"
            onPress={() => setIsAdjustWeightageEnabled(true)}
            isDisabled={
              isLoading || Object.keys(selectedInstrumentsData).length === 0
            }
            size="sm"
            className="w-full"
          >
            <GiInjustice />
          </Button>
        )}
      </div>
    </div>
  );
}
