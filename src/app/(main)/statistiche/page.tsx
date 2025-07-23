import { StatisticsHeader } from "@/components/statistics-header";
import { ExpenseTrendChart } from "@/components/expense-trend-chart";
import { CategoryDistributionChart } from "@/components/category-distribution-chart";
import { IncomeExpenseComparison } from "@/components/home/income-expense-comparison";
import { MonthlyExpenses } from "@/components/monthly-expenses";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatisticsHeader />
      <div className="grid gap-6 xl:grid-cols-2">
        <ExpenseTrendChart />
        <CategoryDistributionChart />
        <IncomeExpenseComparison />
        <MonthlyExpenses />
      </div>
    </div>
  );
}
