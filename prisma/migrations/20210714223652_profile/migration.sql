/*
  Warnings:

  - You are about to drop the column `dataId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userDataId` on the `UserSocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserSocialLink` table. All the data in the column will be lost.
  - You are about to drop the `UserData` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_dataId_fkey";

-- DropForeignKey
ALTER TABLE "UserSocialLink" DROP CONSTRAINT "UserSocialLink_userDataId_fkey";

-- DropForeignKey
ALTER TABLE "UserSocialLink" DROP CONSTRAINT "UserSocialLink_userId_fkey";

-- DropIndex
DROP INDEX "User_dataId_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dataId",
ADD COLUMN     "profileId" INTEGER;

-- AlterTable
ALTER TABLE "UserSocialLink" DROP COLUMN "userDataId",
DROP COLUMN "userId",
ADD COLUMN     "profileId" INTEGER;

-- DropTable
DROP TABLE "UserData";

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT E'',

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_unique" ON "User"("profileId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSocialLink" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
