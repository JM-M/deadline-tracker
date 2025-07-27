import { createContext } from "react";

export const AppContext = createContext<{
  isSettingsDialogOpen: boolean;
  setIsSettingsDialogOpen: (open: boolean) => void;
}>({
  isSettingsDialogOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsSettingsDialogOpen: (open: boolean) => {},
});
