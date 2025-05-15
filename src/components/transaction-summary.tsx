import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getTransactionSummary } from "@/lib/queries/transaction-summary";

export async function TransactionSummary() {
  const { income, expenses, transfers } = await getTransactionSummary();
  const balance = Number(income) + Number(expenses);
  const currentMonth = new Date().toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
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
