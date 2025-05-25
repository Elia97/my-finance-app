import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getTransactionSummary } from "@/lib/queries/transaction-summary";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function TransactionSummary() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const { income, expenses, transfers } = await getTransactionSummary(userId);
  const balance = Number(income) - Number(expenses);
  const currentMonth = new Date().toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  if (!income && !expenses && !transfers) {
    return (
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Riepilogo Mensile</CardTitle>
          <CardDescription>{currentMonth}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Nessuna transazione trovata
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Riepilogo Mensile</CardTitle>
        <CardDescription>{currentMonth}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entrate</span>
            <span className="font-medium text-green-600">
              {formatCurrency(Number(income))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uscite</span>
            <span className="font-medium text-red-600">
              {formatCurrency(Number(expenses))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Trasferimenti</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(Number(transfers))}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Bilancio</span>
              <span
                className={balance >= 0 ? "text-green-600" : "text-red-600"}
              >
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
