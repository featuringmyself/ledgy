-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "deliverableStatus" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[];
