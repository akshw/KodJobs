/*
  Warnings:

  - Added the required column `match` to the `Matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Matches" ADD COLUMN     "match" BOOLEAN NOT NULL,
ADD COLUMN     "requirement" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL;
