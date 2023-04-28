/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `airports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "airports_code_key" ON "airports"("code");
