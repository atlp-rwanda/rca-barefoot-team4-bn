/*
  Warnings:

  - The values [TRAVEL_ADMINISTRATOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('SINGLE', 'DOUBLE', 'DELUXE', 'PRESIDENTIAL', 'STUDIO');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'TRAVEL_ADMIN', 'TRAVEL_TEAM_MEMBER', 'MANAGER', 'REQUESTER', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- CreateTable
CREATE TABLE "accomodation" (
    "id" TEXT NOT NULL,
    "accomodationFacility" TEXT NOT NULL,
    "centerImage" TEXT NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,

    CONSTRAINT "accomodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "roomType" "RoomType" NOT NULL DEFAULT 'SINGLE',
    "accomodationId" TEXT NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accomodation_accomodationFacility_key" ON "accomodation"("accomodationFacility");

-- CreateIndex
CREATE UNIQUE INDEX "room_roomName_key" ON "room"("roomName");

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_accomodationId_fkey" FOREIGN KEY ("accomodationId") REFERENCES "accomodation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
