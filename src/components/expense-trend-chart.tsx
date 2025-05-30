import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendChart } from "./charts/trend-chart";
import { getMonthlyStats } from "@/lib/queries/monthly-stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function ExpenseTrendChart() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const stats = await getMonthlyStats(userId);
  const expenses = stats.map(({ name, expenses }) => ({
    name,
    expenses,
  }));

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Andamento Spese</CardTitle>
          <CardDescription>Nessuna spesa registrata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Non hai ancora registrato spese. Inizia aggiungendo una nuova spesa.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
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
