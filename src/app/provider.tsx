"use client";

import { AppContext } from "@/contexts/app";
import { useState } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{ isSettingsDialogOpen, setIsSettingsDialogOpen }}
    >
      {children}
    </AppContext.Provider>
  );
};
