/*
  Warnings:

  - You are about to drop the column `dailyMaxSc` on the `SavedCasino` table. All the data in the column will be lost.
  - You are about to drop the column `dailyMinSc` on the `SavedCasino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavedCasino" DROP COLUMN "dailyMaxSc",
DROP COLUMN "dailyMinSc",
ADD COLUMN     "dailyScMax" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "dailyScMin" DOUBLE PRECISION NOT NULL DEFAULT 0;
