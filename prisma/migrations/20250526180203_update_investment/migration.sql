/*
  Warnings:

  - You are about to drop the column `purchasePrice` on the `Investment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "purchasePrice",
ADD COLUMN     "averagePrice" DECIMAL(65,30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "InvestmentTransaction" ADD COLUMN     "realizedProfit" DECIMAL(65,30);
