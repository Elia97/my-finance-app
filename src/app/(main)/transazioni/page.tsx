import { prisma } from "@/lib/prisma";
import { serializeDecimals } from "@/lib/serialize-decimals";
import { TransactionsClient } from "@/components/transactions-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!session || !userId) {
    return <div>Accesso negato</div>;
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: {
      sourceAccount: true,
      user: true,
      category: true,
    },
    where: {
      userId: userId,
    },
  });

  const safeTransactions = serializeDecimals(transactions);

  return <TransactionsClient transactions={safeTransactions} />;
}
