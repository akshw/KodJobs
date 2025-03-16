/*
  Warnings:

  - You are about to drop the column `companyNname` on the `Employer` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Employer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employer" DROP COLUMN "companyNname",
ADD COLUMN     "companyName" TEXT NOT NULL,
ALTER COLUMN "requirement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resumeUrl" DROP NOT NULL;
