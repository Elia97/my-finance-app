/*
  Warnings:

  - Added the required column `startDate` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `InvestmentTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "InvestmentTransaction" DROP COLUMN "type",
ADD COLUMN     "type" "InvestmentTransactionType" NOT NULL;
