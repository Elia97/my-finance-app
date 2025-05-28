import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
// import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getInvestmentsData } from "@/lib/queries/investments-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UpdateCurrentPrice } from "./update-current-price";

export async function InvestmentsOverview() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Accesso negato</div>;
  }

  const userId = session.user?.id; // Assicurati di avere l'ID utente dalla sessione
  const investmentsData = await getInvestmentsData(userId); // Replace with actual user ID

  if (investmentsData.totalValue === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Panoramica Portafoglio</CardTitle>
          <CardDescription>Nessun dato disponibile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Non hai ancora aggiunto investimenti. Inizia creando un nuovo
            investimento.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Panoramica Portafoglio</CardTitle>
        <CardDescription>
          Riepilogo del tuo portafoglio investimenti
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Valore Posizione
              </span>
              <span className="text-3xl font-bold">
                {formatCurrency(investmentsData.currentValue)}
              </span>
              <UpdateCurrentPrice />
            </div>

            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                Rendimento Totale
              </span>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xl font-medium",
                    investmentsData.totalReturn < 0
                      ? "text-red-600"
                      : "text-green-600"
                  )}
                >
                  {formatCurrency(investmentsData.totalReturn)} (
                  {investmentsData.totalReturnPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg border">
              <div>
                <span className="text-muted-foreground text-sm">Liquidità</span>
                <div className="text-xl font-medium">
                  {formatCurrency(investmentsData.cashBalance)}
                </div>
              </div>
              {/* <div className="text-sm text-muted-foreground">
                {(
                  (investmentsData.cashBalance / investmentsData.totalValue) *
                  100
                ).toFixed(1)}
                % del portafoglio
              </div> */}
            </div>

            <div className="flex justify-between items-center p-4 rounded-lg border">
              <div>
                <span className="text-muted-foreground text-sm">Investito</span>
                <div className="text-xl font-medium">
                  {formatCurrency(investmentsData.investedAmount)}
                </div>
              </div>
              {/* <div className="text-sm text-muted-foreground">
                {(
                  (investmentsData.investedAmount /
                    investmentsData.totalValue) *
                  100
                ).toFixed(1)}
                % del portafoglio
              </div> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
