/*
  Warnings:

  - Changed the type of `type` on the `Investment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('STOCK', 'BOND', 'ETF', 'CRYPTO');

-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "type",
ADD COLUMN     "type" "InvestmentType" NOT NULL;
