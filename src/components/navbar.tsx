import { SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <nav className="text-muted-foreground container mx-auto flex items-center justify-between px-4 py-5">
      <p className="text-xl font-bold">Ciao, Mike</p>
      <Button size="icon" variant="ghost" className="size-8">
        {/* TODO: Rotate on open and close */}
        <SettingsIcon className="size-6" />
      </Button>
    </nav>
  );
};
