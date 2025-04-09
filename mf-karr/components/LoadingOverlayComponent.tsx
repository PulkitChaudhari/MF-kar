import React from "react";
import { Spinner } from "@nextui-org/react";

interface LoadingOverlayComponentProps {
  message?: string;
}

export default function LoadingOverlayComponent({
  message = "Loading",
}: LoadingOverlayComponentProps) {
  return (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-lg flex flex-col gap-2 text-center items-center justify-center">
      <Spinner />
      {message}
    </div>
  );
}
