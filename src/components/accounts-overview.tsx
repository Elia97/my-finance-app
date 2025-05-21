import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getInvestmentsData } from "@/lib/queries/investments-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function AccountsOverview() {
  const accounts = await prisma.account.findMany();
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id; // Assicurati di avere l'ID utente dalla sessione

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const { totalValue, cashBalance } = await getInvestmentsData(userId);

  const totalBalance = accounts.reduce((acc: number, account) => {
    return acc + Number(account.balance);
  }, 0);

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
                  {account.type === "CHECKING"
                    ? "Conto Corrente"
                    : "Conto Titoli"}
                </div>
              </div>
              <div className="font-medium">
                {account.type === "CHECKING"
                  ? formatCurrency(Number(account.balance))
                  : formatCurrency(totalValue)}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div className="font-medium">Patrimonio Totale</div>
            <div className="text-lg font-bold">
              {formatCurrency(totalBalance + totalValue - cashBalance)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
