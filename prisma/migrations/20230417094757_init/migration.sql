/*
  Warnings:

  - The `lastName` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "lastName",
ADD COLUMN     "lastName" BOOLEAN NOT NULL DEFAULT false;
