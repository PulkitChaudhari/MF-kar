"use client";
import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import { usePortfolioContext } from "@/app/contexts/PortfolioContext";
import { useSession } from "next-auth/react";
import { addToast } from "@heroui/toast";
import { ToastColor } from "@/app/interfaces/interfaces";

export default function ReplacePortfolioModalComponent({
  setIsLoading,
}: {
  setIsLoading: any;
}) {
  const { data: session } = useSession();

  const {
    showSavePortfolioNameModal,
    modalContent,
    setShowSavePortfolioNameModal,
    replacePortfolio,
  } = usePortfolioContext();

  const handleReplacePortfolio = async () => {
    setIsLoading(true);
    try {
      const result = await replacePortfolio(session?.user?.email || "");
      displayToast(result);
      setShowSavePortfolioNameModal(false);
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
            onPress={() => handleReplacePortfolio()}
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
