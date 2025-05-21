import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Landmark, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { getInvestmentsData } from "@/lib/queries/investments-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function AccountsList() {
  const accounts = await prisma.account.findMany();
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id; // Assicurati di avere l'ID utente dalla sessione

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const { totalValue } = await getInvestmentsData(userId);
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Modifica</DropdownMenuItem>
                    <DropdownMenuItem>Transazioni</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Elimina
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {account.number?.slice(0, 4)}****{account.number?.slice(-4)}
                </div>
                <div className="text-xl font-bold text-right">
                  {account.type === "CHECKING"
                    ? formatCurrency(Number(account.balance))
                    : formatCurrency(totalValue)}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Transazioni
                </Button>
                <Button size="sm" className="flex-1">
                  {account.type === "CHECKING"
                    ? "Aggiungi Spesa"
                    : "Aggiungi Deposito"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
