import React from "react";
import SideNavigation from "@/components/SideNavigation";
import SettingsForm from "./components/SettingsForm";

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <SideNavigation />
      </div>
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
