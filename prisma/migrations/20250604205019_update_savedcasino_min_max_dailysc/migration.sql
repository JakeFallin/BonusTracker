/*
  Warnings:

  - You are about to drop the column `dailyScValue` on the `SavedCasino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavedCasino" DROP COLUMN "dailyScValue",
ADD COLUMN     "maxDailySc" DOUBLE PRECISION,
ADD COLUMN     "minDailySc" DOUBLE PRECISION;
