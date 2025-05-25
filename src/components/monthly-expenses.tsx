import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlyExpensesChart } from "./charts/monthly-expenses-chart.tsx";
import { getMonthlyStats } from "@/lib/queries/monthly-stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.ts";

export async function MonthlyExpenses() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }
  const stats = await getMonthlyStats(userId);
  const expensesVsTransfers = stats.map(({ name, expenses, transfers }) => ({
    name,
    expenses,
    transfers,
  }));

  if (expensesVsTransfers.length === 0) {
    return (
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Andamento Spese</CardTitle>
          <CardDescription>Spese e trasferimenti mensili</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Nessuna spesa o trasferimento trovato
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Andamento Spese</CardTitle>
        <CardDescription>Spese e trasferimenti mensili</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlyExpensesChart data={expensesVsTransfers} />
      </CardContent>
    </Card>
  );
}
