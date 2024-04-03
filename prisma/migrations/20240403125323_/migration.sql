-- DropForeignKey
ALTER TABLE "Court" DROP CONSTRAINT "Court_fk_user_fkey";

-- DropForeignKey
ALTER TABLE "OperatingDay" DROP CONSTRAINT "OperatingDay_fk_court_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_fk_operating_day_fkey";

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatingDay" ADD CONSTRAINT "OperatingDay_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_fk_operating_day_fkey" FOREIGN KEY ("fk_operating_day") REFERENCES "OperatingDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
