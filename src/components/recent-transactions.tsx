import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";

// Dati di esempio
const transactions = [
  {
    id: 1,
    description: "Stipendio",
    amount: 1800,
    date: new Date("2023-05-01"),
    type: "income",
    account: "Conto Corrente",
    category: "Stipendio",
  },
  {
    id: 2,
    description: "Supermercato",
    amount: -85.45,
    date: new Date("2023-05-03"),
    type: "expense",
    account: "Conto Corrente",
    category: "Alimentari",
  },
  {
    id: 3,
    description: "Trasferimento a Conto Titoli",
    amount: -500,
    date: new Date("2023-05-05"),
    type: "transfer",
    account: "Conto Corrente",
    category: "Trasferimento",
  },
  {
    id: 4,
    description: "Trasferimento da Conto Corrente",
    amount: 500,
    date: new Date("2023-05-05"),
    type: "transfer",
    account: "Conto Titoli",
    category: "Trasferimento",
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transazioni Recenti</CardTitle>
        <CardDescription>Le tue ultime 4 transazioni</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    transaction.type === "income"
                      ? "bg-green-100"
                      : transaction.type === "expense"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  )}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className={cn("h-5 w-5", "text-green-600")} />
                  ) : transaction.type === "expense" ? (
                    <ArrowDownRight className={cn("h-5 w-5", "text-red-600")} />
                  ) : (
                    <RefreshCw className={cn("h-5 w-5", "text-blue-600")} />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)} • {transaction.account}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "font-medium",
                    transaction.amount > 0
                      ? "text-green-600"
                      : transaction.type === "transfer"
                      ? "text-blue-600"
                      : "text-red-600"
                  )}
                >
                  {formatCurrency(transaction.amount)}
                </div>
                <Badge
                  variant={
                    transaction.type === "income"
                      ? "outline"
                      : transaction.type === "expense"
                      ? "destructive"
                      : "secondary"
                  }
                  className="ml-2"
                >
                  {transaction.type === "income"
                    ? "Entrata"
                    : transaction.type === "expense"
                    ? "Spesa"
                    : "Trasferimento"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
