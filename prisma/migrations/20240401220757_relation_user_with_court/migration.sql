/*
  Warnings:

  - Added the required column `fk_user` to the `Court` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "fk_user" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
