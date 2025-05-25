import { StatisticsHeader } from "@/components/statistics-header";
import { ExpenseTrendChart } from "@/components/expense-trend-chart";
import { CategoryDistributionChart } from "@/components/category-distribution-chart";
import { IncomeExpenseComparison } from "@/components/income-expense-comparison-chart";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatisticsHeader />
      <div className="grid gap-6 xl:grid-cols-2">
        <ExpenseTrendChart />
        <CategoryDistributionChart />
        <IncomeExpenseComparison />
      </div>
    </div>
  );
}
