-- CreateTable
CREATE TABLE "FreeGame" (
    "id" TEXT NOT NULL,
    "fk_court" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hour" TEXT NOT NULL,

    CONSTRAINT "FreeGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FreeGame" ADD CONSTRAINT "FreeGame_fk_court_fkey" FOREIGN KEY ("fk_court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
