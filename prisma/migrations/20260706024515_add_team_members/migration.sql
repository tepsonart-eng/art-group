-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleFr" TEXT NOT NULL DEFAULT '',
    "roleEn" TEXT NOT NULL DEFAULT '',
    "photoPath" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);
