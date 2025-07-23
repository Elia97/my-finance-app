import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonthlyStats } from "@/lib/queries/monthly-stats";
import { IncomeExpenseComparisonChart } from "../charts/income-expense-comparison-chart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function IncomeExpenseComparison() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }
  const stats = await getMonthlyStats(userId);
  const incomeVsExpenses = stats.map(({ name, income, expenses }) => ({
    name,
    income,
    expenses,
  }));

  if (incomeVsExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entrate vs Uscite</CardTitle>
          <CardDescription>Nessuna informazione disponibile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Non hai ancora registrato entrate o uscite. Inizia aggiungendo una
            nuova transazione.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle>Entrate vs Uscite</CardTitle>
        <CardDescription>
          Confronto tra entrate e uscite mensili
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IncomeExpenseComparisonChart data={incomeVsExpenses} />
      </CardContent>
    </Card>
  );
}
