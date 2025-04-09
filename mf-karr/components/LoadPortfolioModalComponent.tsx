"use client";
import React from "react";
import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { CiExport, DeleteIcon } from "../app/icons";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";
import { useSession } from "next-auth/react";
import { useBacktestContext } from "@/app/contexts/BacktestContext";

export default function LoadPortfolioModalComponent({
  setIsLoading,
}: {
  setIsLoading: any;
}) {
  const { data: session } = useSession();

  const {
    showSavedPortolioModal,
    userSavedPortfolios,
    setShowSavedPortolioModal,
    loadPortfolio,
    deletePortfolio,
  } = usePortfolioContext();

  const { selectedTimePeriod } = useBacktestContext();

  const handleLoadPortfolio = async (portfolio: any) => {
    setIsLoading(true);
    try {
      setShowSavedPortolioModal(false);
      await loadPortfolio(portfolio, Number(selectedTimePeriod));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePortfolio = async (portfolio: any) => {
    setIsLoading(true);
    try {
      await deletePortfolio(portfolio, session?.user?.email || "");
      setShowSavedPortolioModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isDismissable={true}
      isKeyboardDismissDisabled={true}
      isOpen={showSavedPortolioModal}
      hideCloseButton={false}
      className="p-2"
      onClose={() => setShowSavedPortolioModal(false)}
      size="sm"
    >
      <ModalContent>
        <ModalBody className="max-h-[50vh]">
          <div className="overflow-y-auto">
            {userSavedPortfolios.length > 0 ? (
              userSavedPortfolios.map((row: any) => {
                return (
                  <div key={row.portfolioName} className="w-full flex">
                    <div className="col-span-4 flex w-full justify-between p-2">
                      <div className="text-sm flex items-center">
                        {row?.portfolioName}
                      </div>
                      <div className="flex gap-2 mr-1">
                        <Button
                          isIconOnly
                          variant="bordered"
                          className="hover:bg-green-400 transition-all"
                          onPress={() => handleLoadPortfolio(row)}
                          type="submit"
                        >
                          <CiExport className="cursor-pointer text-green-500" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="bordered"
                          className="hover:bg-red-400 transition-all"
                        >
                          <DeleteIcon
                            className="cursor-pointer text-red-500"
                            onClick={() => {
                              handleDeletePortfolio(row);
                            }}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>You haven't saved any portfolios yet</div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
