/*
  Warnings:

  - You are about to drop the column `lastVisitedAt` on the `SavedCasino` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SavedCasino" DROP COLUMN "lastVisitedAt",
ADD COLUMN     "lastVisited" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "SavedCasino_userId_idx" ON "SavedCasino"("userId");
