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
import { prisma } from "@/lib/prisma";

export async function RecentTransactions() {
  const transactions = await prisma.transaction.findMany({
    take: 4, // Prende solo le ultime 4
    orderBy: {
      date: "desc", // Ordina dalla più recente alla meno recente
    },
    include: {
      sourceAccount: true,
      destinationAccount: true,
      user: true,
      category: true,
    },
  });

  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Transazioni Recenti</CardTitle>
        <CardDescription>Le tue ultime 4 transazioni</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border p-3 relative"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    transaction.type === "INCOME"
                      ? "bg-green-100"
                      : transaction.type === "EXPENSE"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  )}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowUpRight className={cn("h-5 w-5", "text-green-600")} />
                  ) : transaction.type === "EXPENSE" ? (
                    <ArrowDownRight className={cn("h-5 w-5", "text-red-600")} />
                  ) : (
                    <RefreshCw className={cn("h-5 w-5", "text-blue-600")} />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.destinationAccount
                      ? `${transaction.sourceAccount.name} • ${transaction.destinationAccount.name}`
                      : `${formatDate(transaction.date)} • ${
                          transaction.sourceAccount.name
                        }`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "font-medium",
                    transaction.type === "INCOME"
                      ? " text-green-700"
                      : transaction.type === "EXPENSE"
                      ? " text-red-700"
                      : " text-blue-700"
                  )}
                >
                  {formatCurrency(Number(transaction.amount))}
                </div>
                <Badge
                  variant="default"
                  className={cn(
                    "absolute -right-2 -top-2",
                    transaction.type === "INCOME"
                      ? "bg-green-100 text-green-700"
                      : transaction.type === "EXPENSE"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {transaction.type === "INCOME"
                    ? "Entrata"
                    : transaction.type === "EXPENSE"
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
