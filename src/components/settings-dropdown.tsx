import { useAppContext } from "@/hooks/use-app-context";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsSettingsDialogOpen } = useAppContext();
  const router = useRouter();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 focus-visible:ring-0"
        >
          <SettingsIcon
            className={cn(
              "size-6 transition-transform duration-200 ease-in-out",
              isOpen && "rotate-90",
            )}
            strokeWidth={1.5}
            stroke="currentColor"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem onClick={() => setIsSettingsDialogOpen(true)}>
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
