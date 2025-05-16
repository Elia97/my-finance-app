import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendChart } from "./charts/trend-chart";
import { getExpensesByMonth } from "@/lib/queries/expenses-by-month";

export async function ExpenseTrendChart() {
  const data = await getExpensesByMonth();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Andamento Spese</CardTitle>
        <CardDescription>
          Trend delle spese negli ultimi 12 mesi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TrendChart data={data} />
      </CardContent>
    </Card>
  );
}
