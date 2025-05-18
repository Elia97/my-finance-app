import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendChart } from "./charts/trend-chart";
import { getMonthlyStats } from "@/lib/queries/monthly-stats";

export async function ExpenseTrendChart() {
  const stats = await getMonthlyStats();
  const expenses = stats.map(({ name, expenses }) => ({
    name,
    expenses,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Andamento Spese</CardTitle>
        <CardDescription>Trend delle spese</CardDescription>
      </CardHeader>
      <CardContent>
        <TrendChart data={expenses} />
      </CardContent>
    </Card>
  );
}
