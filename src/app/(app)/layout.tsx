import { Navbar } from "@/components/navbar";
import { SettingsDialog } from "@/components/settings-dialog";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <SettingsDialog />
      <main className="flex min-h-screen flex-col p-4 pb-28">{children}</main>
    </div>
  );
};

export default AppLayout;
