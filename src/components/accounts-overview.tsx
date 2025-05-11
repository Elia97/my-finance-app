import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

// Dati di esempio
const accounts = [
  {
    id: 1,
    name: "Conto Corrente",
    balance: 2450.75,
    type: "checking",
  },
  {
    id: 2,
    name: "Conto Titoli",
    balance: 8750.32,
    type: "savings",
  },
];

export function AccountsOverview() {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>I tuoi conti</CardTitle>
        <CardDescription>Panoramica dei tuoi conti finanziari</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <div className="font-medium">{account.name}</div>
                <div className="text-sm text-muted-foreground">
                  {account.type === "checking"
                    ? "Conto Corrente"
                    : "Conto Titoli"}
                </div>
              </div>
              <div className="font-medium">
                {formatCurrency(account.balance)}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div className="font-medium">Patrimonio Totale</div>
            <div className="text-lg font-bold">
              {formatCurrency(totalBalance)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
