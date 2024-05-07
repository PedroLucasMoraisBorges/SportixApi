-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "status" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "RecurrenceUser" (
    "id" TEXT NOT NULL,
    "range_days" INTEGER NOT NULL,
    "fk_court" TEXT NOT NULL,
    "fk_day" TEXT NOT NULL,
    "fk_time" TEXT NOT NULL,
    "fk_user" TEXT NOT NULL,

    CONSTRAINT "RecurrenceUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecurrenceUser" ADD CONSTRAINT "RecurrenceUser_fk_time_fkey" FOREIGN KEY ("fk_time") REFERENCES "Time"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurrenceUser" ADD CONSTRAINT "RecurrenceUser_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurrenceUser" ADD CONSTRAINT "RecurrenceUser_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurrenceUser" ADD CONSTRAINT "RecurrenceUser_fk_day_fkey" FOREIGN KEY ("fk_day") REFERENCES "OperatingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
