import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function TransactionSummary() {
  // Dati di esempio per il mese corrente
  const currentMonthData = {
    income: 2300,
    expenses: 1450.25,
    savings: 500,
  };

  const balance =
    currentMonthData.income -
    currentMonthData.expenses -
    currentMonthData.savings;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riepilogo Mensile</CardTitle>
        <CardDescription>Maggio 2023</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entrate</span>
            <span className="font-medium text-green-600">
              {formatCurrency(currentMonthData.income)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uscite</span>
            <span className="font-medium text-red-600">
              {formatCurrency(currentMonthData.expenses)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Risparmi</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(currentMonthData.savings)}
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
