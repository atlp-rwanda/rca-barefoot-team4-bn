-- DropIndex
DROP INDEX "flights_airline_key";

-- AlterTable
ALTER TABLE "flights" ALTER COLUMN "airline" DROP DEFAULT;
