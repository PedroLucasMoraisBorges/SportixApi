/*
  Warnings:

  - You are about to drop the column `vale` on the `Court` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Court" DROP COLUMN "vale",
ADD COLUMN     "value" DECIMAL(65,30) NOT NULL DEFAULT 0;
