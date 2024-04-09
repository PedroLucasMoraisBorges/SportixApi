-- CreateTable
CREATE TABLE "Closure" (
    "id" TEXT NOT NULL,
    "fk_court" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hour" TEXT NOT NULL,

    CONSTRAINT "Closure_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Closure" ADD CONSTRAINT "Closure_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
