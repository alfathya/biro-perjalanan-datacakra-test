/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `Tourist` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `Tourist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Tourist` DROP COLUMN `approvedAt`,
    DROP COLUMN `isApproved`;
