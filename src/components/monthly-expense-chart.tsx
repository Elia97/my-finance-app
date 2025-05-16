import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentYearStats } from "@/lib/queries/current-year-stats";
import { MonthlyChart } from "./charts/monthly-chart";

export async function MonthlyExpenseChart() {
  const stats = await getCurrentYearStats();
  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Andamento Mensile</CardTitle>
        <CardDescription>Entrate e uscite mensili</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyChart data={stats} />
      </CardContent>
    </Card>
  );
}
