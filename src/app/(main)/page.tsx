import {
  AccountsOverview,
  DashboardHeader,
  TransfersComparison,
  TransactionsSummary,
  IncomeExpenseComparison,
  RecentTransactions,
} from "@/components/home";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AccountsOverview />
        <TransactionsSummary />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <IncomeExpenseComparison />
        <RecentTransactions />
        <TransfersComparison />
      </div>
    </div>
  );
}
