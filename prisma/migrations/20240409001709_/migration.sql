/*
  Warnings:

  - You are about to drop the `Cancellation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cancellation" DROP CONSTRAINT "Cancellation_fk_court_fkey";

-- DropForeignKey
ALTER TABLE "Cancellation" DROP CONSTRAINT "Cancellation_fk_user_fkey";

-- DropTable
DROP TABLE "Cancellation";
