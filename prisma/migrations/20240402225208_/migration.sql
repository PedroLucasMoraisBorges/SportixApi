/*
  Warnings:

  - You are about to drop the `Times` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Times" DROP CONSTRAINT "Times_fk_court_fkey";

-- DropForeignKey
ALTER TABLE "Times" DROP CONSTRAINT "Times_fk_user_fkey";

-- DropTable
DROP TABLE "Times";

-- CreateTable
CREATE TABLE "OperatingDay" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "fk_court" TEXT NOT NULL,

    CONSTRAINT "OperatingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "fk_operating_day" TEXT NOT NULL,
    "fk_user" TEXT,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OperatingDay" ADD CONSTRAINT "OperatingDay_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_fk_operating_day_fkey" FOREIGN KEY ("fk_operating_day") REFERENCES "OperatingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
