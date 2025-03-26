/*
  Warnings:

  - You are about to drop the column `matches` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employer" ADD COLUMN     "requirementUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "matches";

-- CreateTable
CREATE TABLE "Matches" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "employerId" INTEGER NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
