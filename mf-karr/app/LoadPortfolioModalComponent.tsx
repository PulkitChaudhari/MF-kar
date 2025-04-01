"use client";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import { CiExport, DeleteIcon } from "./icons";

export default function LoadPortfolioModalComponent({
  showSavedPortolioModal,
  setShowSavedPortolioModal,
  userSavedPortfolios,
  loadPortfolio,
  deletePortfolio,
}: {
  showSavedPortolioModal: any;
  setShowSavedPortolioModal: any;
  userSavedPortfolios: any;
  loadPortfolio: any;
  deletePortfolio: any;
}) {
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
                          onPress={() => loadPortfolio(row)}
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
                              deletePortfolio(row);
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
