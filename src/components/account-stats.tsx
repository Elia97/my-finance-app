import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { getAccountStats } from "@/lib/queries/account-stats";
import { getInvestmentsData } from "@/lib/queries/investments-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function AccountStats() {
  const { totalBalance, totalIncome, totalExpenses, totalTransfers } =
    await getAccountStats();

  const session = await getServerSession(authOptions);

  const userId = session?.user?.id; // Assicurati di avere l'ID utente dalla sessione

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const { investedAmount, totalReturn } = await getInvestmentsData(userId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiche Conti</CardTitle>
        <CardDescription>Panoramica delle tue finanze</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col rounded-lg border p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Patrimonio Totale
            </div>
            <div className="mt-1 text-2xl font-bold">
              {formatCurrency(
                Number(totalBalance) + investedAmount + totalReturn
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border p-4">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
              <div className="mt-2 text-sm font-medium text-muted-foreground">
                Entrate
              </div>
              <div className="mt-1 text-lg font-bold text-green-600">
                {formatCurrency(Number(totalIncome))}
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg border p-4">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
              <div className="mt-2 text-sm font-medium text-muted-foreground">
                Uscite
              </div>
              <div className="mt-1 text-lg font-bold text-red-600">
                {formatCurrency(Number(totalExpenses))}
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg border p-4">
              <RefreshCw className="h-6 w-6 text-blue-600" />
              <div className="mt-2 text-sm font-medium text-muted-foreground">
                Trasferimenti
              </div>
              <div className="mt-1 text-lg font-bold text-blue-600">
                {formatCurrency(Number(totalTransfers))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
