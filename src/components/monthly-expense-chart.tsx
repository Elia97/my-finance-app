import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLastThreeMonthsStats } from "@/lib/queries/last-three-months-stats";
import { MonthlyChart } from "./charts/monthly-chart";

export async function MonthlyExpenseChart() {
  const stats = await getLastThreeMonthsStats();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Andamento Ultimi 3 mesi</CardTitle>
        <CardDescription>Entrate e uscite mensili</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyChart data={stats} />
      </CardContent>
    </Card>
  );
}
