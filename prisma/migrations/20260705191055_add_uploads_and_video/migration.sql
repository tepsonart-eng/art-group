-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imagePath" TEXT;

-- AlterTable
ALTER TABLE "PartnerLogo" ADD COLUMN     "logoImagePath" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "videoFilePath" TEXT;

-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "adSpaceMediaPath" TEXT,
ADD COLUMN     "adSpaceMediaType" TEXT,
ADD COLUMN     "whyUsImagePath" TEXT;
