import { AccountsHeader } from "@/components/accounts-header";
import { AccountsList } from "@/components/accounts-list";
import { AccountStats } from "@/components/account-stats";

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AccountsHeader />
      <div className="grid gap-6 xl:grid-cols-2">
        <AccountsList />
        <AccountStats />
      </div>
    </div>
  );
}
