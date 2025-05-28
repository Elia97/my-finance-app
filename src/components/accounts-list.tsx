import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Landmark } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getInvestmentsData } from "@/lib/queries/investments-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UpdateAccount } from "./update-account";
import { DeleteAccount } from "./delete-account";

export async function AccountsList() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id; // Assicurati di avere l'ID utente dalla sessione

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const accounts = await prisma.account.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const { totalValue } = await getInvestmentsData(userId);

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conti</CardTitle>
          <CardDescription>Nessun conto trovato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Non hai ancora aggiunto conti. Inizia creando un nuovo conto.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>I tuoi conti</CardTitle>
        <CardDescription>Gestisci i tuoi conti finanziari</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex flex-col rounded-lg border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {account.type === "CHECKING" ? (
                    <CreditCard className="h-8 w-8 text-primary" />
                  ) : (
                    <Landmark className="h-8 w-8 text-primary" />
                  )}
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.type === "CHECKING"
                        ? "Conto Corrente"
                        : "Conto Titoli"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {account.number?.slice(0, 4)}****
                  {account.number?.slice(-4)}
                </div>
                <div className="text-xl font-bold text-right">
                  {account.type === "CHECKING"
                    ? formatCurrency(Number(account.balance))
                    : formatCurrency(totalValue)}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <UpdateAccount accountId={account.id} />
                <DeleteAccount accountId={account.id} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
