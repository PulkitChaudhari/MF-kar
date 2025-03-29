"use client";
import React from "react";
import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function LoginComponent() {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={true}
      hideCloseButton={true}
      className="p-2"
    >
      <ModalContent>
        <ModalBody>
          <Button
            isIconOnly
            variant="bordered"
            onPress={() => signIn("github")}
            className="w-full p-2"
          >
            Sign In Github
          </Button>
          <Button
            isIconOnly
            variant="bordered"
            onPress={() => signIn("google")}
            className="w-full p-2"
          >
            Sign In Google
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
