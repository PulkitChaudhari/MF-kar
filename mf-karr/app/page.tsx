"use client";

import { useSession } from "next-auth/react";
import { AppProvider } from "./contexts/AppProvider";
import LoginComponent from "@/components/LoginModalComponent";
import PortfolioContentComponent from "@/components/PortfolioContentComponent";

// Main page component with context providers
export default function LandingPageComponent() {
  const { data: session } = useSession();

  return (
    <div className="h-full w-full">
      <AppProvider>
        {!session ? <LoginComponent /> : <PortfolioContentComponent />}
      </AppProvider>
    </div>
  );
}
