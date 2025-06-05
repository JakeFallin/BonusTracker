/*
  Warnings:

  - You are about to drop the column `maxDailySc` on the `SavedCasino` table. All the data in the column will be lost.
  - You are about to drop the column `minDailySc` on the `SavedCasino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavedCasino" DROP COLUMN "maxDailySc",
DROP COLUMN "minDailySc",
ADD COLUMN     "dailyMaxSc" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "dailyMinSc" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalBalance" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalDailyScMax" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalDailyScMin" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalDeposits" DOUBLE PRECISION DEFAULT 0;
