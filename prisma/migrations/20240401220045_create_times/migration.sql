-- CreateTable
CREATE TABLE "Times" (
    "id" TEXT NOT NULL,
    "hour" DECIMAL(65,30) NOT NULL,
    "fk_Court" TEXT NOT NULL,

    CONSTRAINT "Times_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_fk_Court_fkey" FOREIGN KEY ("fk_Court") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
