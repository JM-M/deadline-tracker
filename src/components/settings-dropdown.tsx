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
        <DropdownMenuItem onClick={onLogout}>
          {/* <LogOut className="mr-2 h-4 w-4" /> */}
          <span>Logout</span>
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
        {/* TODO: Add more menu items here as needed */}
        {/* Examples:
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
