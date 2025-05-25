import { prisma } from "@/lib/prisma";

export async function getCategoryDistribution(userId: string) {
  // 1. Recupera tutte le categorie con le transazioni
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      transactions: {
        where: {
          type: "EXPENSE", // Filtro per le sole spese
        },
        select: {
          amount: true,
        },
      },
    },
    where: {
      userId: userId, // Assicurati di filtrare per l'utente corrente
    },
  });

  // 2. Mappa le categorie e somma gli importi delle transazioni
  return categories.map((category) => {
    const totalAmount = category.transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0
    );

    return {
      name: category.name,
      value: totalAmount, // Somma totale delle spese per la categoria
      color: category.color ?? "#FFFFFF", // Fallback al colore bianco se manca
    };
  });
}
