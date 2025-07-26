import { createContext } from "react";

export const AppContext = createContext({
  isSettingsDialogOpen: false,
  setIsSettingsDialogOpen: (open: boolean) => {},
});
