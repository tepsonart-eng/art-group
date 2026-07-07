-- CreateEnum
CREATE TYPE "VideoSourceType" AS ENUM ('UPLOAD', 'YOUTUBE', 'VIMEO', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "TrainingLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "TrainingCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrainingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "shortDescFr" TEXT NOT NULL DEFAULT '',
    "shortDescEn" TEXT NOT NULL DEFAULT '',
    "presentationFr" TEXT NOT NULL DEFAULT '',
    "presentationEn" TEXT NOT NULL DEFAULT '',
    "objectivesFr" TEXT NOT NULL DEFAULT '',
    "objectivesEn" TEXT NOT NULL DEFAULT '',
    "level" "TrainingLevel" NOT NULL DEFAULT 'BEGINNER',
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "thumbnailPath" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingLesson" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "videoSourceType" "VideoSourceType" NOT NULL DEFAULT 'UPLOAD',
    "videoFilePath" TEXT,
    "youtubeUrl" TEXT,
    "vimeoUrl" TEXT,
    "externalUrl" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrainingLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingResource" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrainingResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingFaqItem" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "questionFr" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerFr" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrainingFaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingComment" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "ipAddress" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingCategory_slug_key" ON "TrainingCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Training_slug_key" ON "Training"("slug");

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TrainingCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingLesson" ADD CONSTRAINT "TrainingLesson_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingResource" ADD CONSTRAINT "TrainingResource_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingFaqItem" ADD CONSTRAINT "TrainingFaqItem_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingComment" ADD CONSTRAINT "TrainingComment_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;
