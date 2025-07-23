import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonthlyStats } from "@/lib/queries/monthly-stats";
import { TransfersChart } from "../charts/transfers-chart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function TransfersComparison() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }
  const stats = await getMonthlyStats(userId);
  const transfers = stats.map(({ name, transfers }) => ({
    name,
    transfers,
  }));

  if (transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trasferimenti</CardTitle>
          <CardDescription>Nessuna informazione disponibile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Non hai ancora registrato trasferimenti. Inizia aggiungendo una
            nuova transazione.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle>Trasferimenti</CardTitle>
        <CardDescription>Confronto tra trasferimenti mensili</CardDescription>
      </CardHeader>
      <CardContent>
        <TransfersChart data={transfers} />
      </CardContent>
    </Card>
  );
}
