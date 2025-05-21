/*
  Warnings:

  - Added the required column `price` to the `InvestmentTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `InvestmentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvestmentTransaction" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "quantity" DECIMAL(65,30) NOT NULL;
