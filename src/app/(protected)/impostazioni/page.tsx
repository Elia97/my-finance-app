import { SettingsHeader } from "@/components/settings-header";
import { SettingsTabs } from "@/components/settings-tabs";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader />
      <SettingsTabs />
    </div>
  );
}
