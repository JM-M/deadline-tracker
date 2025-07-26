"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/hooks/use-app-context";
import { SettingsForm } from "./settings-form";

export const SettingsDialog = () => {
  const { isSettingsDialogOpen, setIsSettingsDialogOpen } = useAppContext();

  const handleFormSubmit = () => {
    setIsSettingsDialogOpen(false);
  };

  return (
    <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Make changes to your settings here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <SettingsForm onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
};
