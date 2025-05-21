/*
  Warnings:

  - Added the required column `accountId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
