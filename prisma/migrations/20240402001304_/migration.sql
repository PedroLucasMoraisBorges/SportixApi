/*
  Warnings:

  - Changed the type of `hour` on the `Times` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Times" DROP COLUMN "hour",
ADD COLUMN     "hour" TIMESTAMP(3) NOT NULL;
