/*
  Warnings:

  - You are about to drop the column `fk_Court` on the `Times` table. All the data in the column will be lost.
  - Added the required column `fk_court` to the `Times` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Times" DROP CONSTRAINT "Times_fk_Court_fkey";

-- AlterTable
ALTER TABLE "Times" DROP COLUMN "fk_Court",
ADD COLUMN     "fk_court" TEXT NOT NULL,
ADD COLUMN     "fk_user" TEXT;

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
