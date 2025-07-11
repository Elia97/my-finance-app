import { DashboardHeader } from "@/components/dashboard-header";
import { AccountsOverview } from "@/components/accounts-overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { MonthlyExpenses } from "@/components/monthly-expenses";
import TransactionSummary from "@/components/transaction-summary";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AccountsOverview />
        <TransactionSummary />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyExpenses />
        <RecentTransactions />
      </div>
    </div>
  );
}
