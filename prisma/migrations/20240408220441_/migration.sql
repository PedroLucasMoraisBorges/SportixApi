-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "fk_user" TEXT NOT NULL,
    "fk_court" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hour" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_fk_user_fkey" FOREIGN KEY ("fk_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
