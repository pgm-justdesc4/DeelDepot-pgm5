import SideNavigation from "@/components/SideNavigation";
import SettingsForm from "./components/SettingsForm";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <SideNavigation />
      </div>
      <SettingsForm />
    </div>
  );
}
