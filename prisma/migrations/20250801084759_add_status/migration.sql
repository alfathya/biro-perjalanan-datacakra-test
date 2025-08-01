-- AlterTable
ALTER TABLE `Payment` MODIFY `status` ENUM('pending', 'paid', 'refunded', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `Trip` MODIFY `status` ENUM('planned', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'planned';
