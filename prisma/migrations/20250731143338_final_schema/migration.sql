/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Trip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tripId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tripId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Trip` DROP FOREIGN KEY `Trip_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `Trip` DROP FOREIGN KEY `Trip_touristId_fkey`;

-- DropIndex
DROP INDEX `Trip_paymentId_key` ON `Trip`;

-- DropIndex
DROP INDEX `Trip_touristId_fkey` ON `Trip`;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `tripId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Tourist` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Trip` DROP COLUMN `paymentId`;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_tripId_key` ON `Payment`(`tripId`);

-- CreateIndex
CREATE INDEX `Tourist_membershipLevel_idx` ON `Tourist`(`membershipLevel`);

-- CreateIndex
CREATE INDEX `User_role_idx` ON `User`(`role`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_touristId_fkey` FOREIGN KEY (`touristId`) REFERENCES `Tourist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
