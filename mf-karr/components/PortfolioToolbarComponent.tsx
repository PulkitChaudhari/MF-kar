"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import {
  TfiSave,
  CiExport,
  GiInjustice,
  RxCross2,
  FaCheck,
} from "../app/icons";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { ToastColor } from "@/app/interfaces/interfaces";
import { apiService } from "@/app/services/api.service";

export default function PortfolioToolbarComponent({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: any;
}) {
  const { data: session } = useSession();

  const {
    selectedInstrumentsData,
    isAdjustWeightageEnabled,
    isSaveButtonEnabled,
    setIsAdjustWeightageEnabled,
    onSave,
    onCancelWeightAdjust,
    savePortfolio,
    setModalContent,
    setShowSavePortfolioNameModal,
    setUserSavedPortfolios,
    setShowSavedPortolioModal,
  } = usePortfolioContext();

  const handleSavePortfolio = async () => {
    setIsLoading(true);
    try {
      const result = await savePortfolio(session?.user?.email || "");
      if (result.type === "danger" && result.title !== "Duplicate Portfolio") {
        setModalContent(result.title);
        setShowSavePortfolioNameModal(true);
      } else {
        displayToast(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayToast = (toastData: { type: ToastColor; title: string }) => {
    addToast({
      title: toastData.title,
      color: toastData.type,
    });
  };

  const openPortfolioModal = async () => {
    setIsLoading(true);
    try {
      if (session?.user?.email) {
        const res = await apiService.getPortfolios(session.user.email);
        let tempPortfolios: any[] = [];
        res.forEach((portfolio: any) => {
          tempPortfolios.push({
            portfolioName: portfolio[2],
            instruments: JSON.parse(portfolio[1]),
          });
        });
        setUserSavedPortfolios(tempPortfolios);
        setShowSavedPortolioModal(true);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex grow gap-2">
      <div className="flex gap-2">
        <Button
          isIconOnly
          variant="flat"
          onPress={() => handleSavePortfolio()}
          isDisabled={
            isLoading || Object.keys(selectedInstrumentsData).length === 0
          }
          size="sm"
          className="dark:bg-stone-800"
        >
          <TfiSave />
        </Button>
        <Button
          isIconOnly
          variant="flat"
          onPress={() => openPortfolioModal()}
          isDisabled={isLoading}
          size="sm"
          className="dark:bg-stone-800"
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
            variant="flat"
            onPress={() => setIsAdjustWeightageEnabled(true)}
            isDisabled={
              isLoading || Object.keys(selectedInstrumentsData).length === 0
            }
            size="sm"
            className="w-full dark:bg-stone-800"
          >
            <GiInjustice />
          </Button>
        )}
      </div>
    </div>
  );
}
