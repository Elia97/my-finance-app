import { SettingsHeader } from "@/components/settings-header";
import { SettingsTabs } from "@/components/settings-tabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Accesso negato</div>;
  }
  const userId = session.user?.id; // Assicurati di avere l'ID utente dalla session

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader />
      <SettingsTabs userId={userId} />
    </div>
  );
}
