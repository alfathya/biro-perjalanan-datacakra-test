/*
  Warnings:

  - You are about to drop the column `passportNumber` on the `Tourist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Tourist` DROP COLUMN `passportNumber`,
    ADD COLUMN `identityNumber` VARCHAR(191) NULL;
