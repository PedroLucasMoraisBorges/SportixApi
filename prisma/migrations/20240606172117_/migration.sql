-- CreateTable
CREATE TABLE "RecurrenceUserCancelations" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "fk_recurrence" TEXT NOT NULL,

    CONSTRAINT "RecurrenceUserCancelations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecurrenceUserCancelations" ADD CONSTRAINT "RecurrenceUserCancelations_fk_recurrence_fkey" FOREIGN KEY ("fk_recurrence") REFERENCES "RecurrenceUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
