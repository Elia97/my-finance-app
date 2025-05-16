import { StatisticsHeader } from "@/components/statistics-header";
import { ExpenseTrendChart } from "@/components/expense-trend-chart";
import { CategoryDistributionChart } from "@/components/category-distribution-chart";
import { IncomeExpenseComparisonChart } from "@/components/income-expense-comparison-chart";
import { SavingsGoalProgress } from "@/components/savings-goal-progress";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatisticsHeader />
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseTrendChart />
        <CategoryDistributionChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <IncomeExpenseComparisonChart />
        <SavingsGoalProgress />
      </div>
    </div>
  );
}
