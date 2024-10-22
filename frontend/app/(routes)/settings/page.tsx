import SideNavigation from "@/components/SideNavigation";
import SettingsForm from "./components/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="flex">
      <SideNavigation />
      <SettingsForm />
    </div>
  );
}
