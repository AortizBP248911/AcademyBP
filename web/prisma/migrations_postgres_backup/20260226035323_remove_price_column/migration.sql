/*
  Warnings:

  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "price";

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
