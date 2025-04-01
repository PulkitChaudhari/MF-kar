"use client";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";

export default function ReplacePortfolioModalComponent({
  showSavePortfolioNameModal,
  modalContent,
  replacePortfolio,
  setShowSavePortfolioNameModal,
}: {
  showSavePortfolioNameModal: any;
  modalContent: any;
  replacePortfolio: any;
  setShowSavePortfolioNameModal: any;
}) {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={showSavePortfolioNameModal}
      hideCloseButton={true}
      className="p-2"
    >
      <ModalContent className="w-full">
        <ModalBody className="w-full items-center text-center justify-center">
          {modalContent}
        </ModalBody>
        <ModalFooter className="w-full h-full ">
          <Button
            variant="bordered"
            className="w-1/2 hover:bg-green-400 transition-all"
            onPress={() => replacePortfolio()}
          >
            <div className="flex flex-col w-full">Replace</div>
          </Button>
          <Button
            variant="bordered"
            className="w-1/2 hover:bg-red-400 transition-all"
            onPress={() => setShowSavePortfolioNameModal(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
