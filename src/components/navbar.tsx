"use client";

import { authClient } from "@/lib/auth-client";
import { SettingsDropdown } from "./settings-dropdown";

export const Navbar = () => {
  const { data } = authClient.useSession();

  let greeting = "Ciao";
  if (data?.user?.name) {
    greeting = `Ciao, ${data.user.name}`;
  }

  return (
    <nav className="text-muted-foreground container mx-auto flex items-center justify-between px-4 py-5">
      <p className="text-xl font-bold">{greeting}</p>
      <SettingsDropdown />
    </nav>
  );
};
