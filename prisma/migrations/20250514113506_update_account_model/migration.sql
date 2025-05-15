/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_number_key" ON "Account"("number");
