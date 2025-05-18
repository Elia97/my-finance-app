import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlyChart } from "./charts/monthly-chart";
import { getMonthlyStats } from "@/lib/queries/monthly-stats";

export async function MonthlyExpenseChart() {
  const stats = await getMonthlyStats();
  const exitsVsTransfers = stats.map(({ name, expenses, transfers }) => ({
    name,
    expenses,
    transfers,
  }));
  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Andamento Spese</CardTitle>
        <CardDescription>Spese e trasferimenti mensili</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyChart data={exitsVsTransfers} />
      </CardContent>
    </Card>
  );
}
