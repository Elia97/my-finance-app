import { prisma } from "@/lib/prisma";
import Decimal from "decimal.js";

export async function getInvestmentsData(userId: string) {
  const [cashSum, investments] = await Promise.all([
    prisma.account.aggregate({
      _sum: {
        balance: true,
      },
      where: {
        userId,
        type: "INVESTMENT",
      },
    }),

    prisma.investment.findMany({
      where: {
        userId,
        quantity: {
          gt: 0, // <-- Filtro per evitare investimenti "liquidati"
        },
      },
      select: {
        quantity: true,
        averagePrice: true,
        currentPrice: true,
      },
    }),
  ]);

  const cashBalance = new Decimal(cashSum._sum.balance || 0);

  let investedAmount = new Decimal(0);
  let currentValue = new Decimal(0);

  for (const inv of investments) {
    const quantity = new Decimal(inv.quantity);
    const purchase = new Decimal(inv.averagePrice);
    const current = new Decimal(inv.currentPrice);

    investedAmount = investedAmount.plus(quantity.times(purchase));
    currentValue = currentValue.plus(quantity.times(current));
  }

  const totalReturn = currentValue.minus(investedAmount);
  const totalValue = new Decimal(cashBalance).plus(currentValue);

  const totalReturnPercentage = investedAmount.gt(0)
    ? totalReturn.dividedBy(investedAmount).times(100)
    : new Decimal(0);

  return {
    totalValue: totalValue.toNumber(),
    currentValue: currentValue.toNumber(),
    cashBalance: cashBalance.toNumber(),
    investedAmount: investedAmount.toNumber(),
    totalReturn: totalReturn.toNumber(),
    totalReturnPercentage: totalReturnPercentage.toNumber(),
  };
}
