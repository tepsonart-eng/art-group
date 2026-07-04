-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visualOnly" BOOLEAN NOT NULL DEFAULT false,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "itemsFr" TEXT NOT NULL DEFAULT '',
    "itemsEn" TEXT NOT NULL DEFAULT '',
    "colorFrom" TEXT NOT NULL DEFAULT '#dc2626',
    "colorTo" TEXT NOT NULL DEFAULT '#111111'
);

-- CreateTable
CREATE TABLE "PortfolioTab" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "colorFrom" TEXT NOT NULL DEFAULT '#dc2626',
    "colorTo" TEXT NOT NULL DEFAULT '#111111',
    "youtubeUrl" TEXT,
    "contextFr" TEXT NOT NULL DEFAULT '',
    "contextEn" TEXT NOT NULL DEFAULT '',
    "objectivesFr" TEXT NOT NULL DEFAULT '',
    "objectivesEn" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "projectDate" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "clientRole" TEXT NOT NULL DEFAULT '',
    "companyName" TEXT NOT NULL DEFAULT '',
    "colorHex" TEXT NOT NULL DEFAULT '#dc2626',
    "quoteFr" TEXT NOT NULL,
    "quoteEn" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ipAddress" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BannedIp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionFr" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerFr" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "PartnerLogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PARTNER',
    "colorHex" TEXT NOT NULL DEFAULT '#dc2626',
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '',
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "budget" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WhyChooseUsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iconKey" TEXT NOT NULL DEFAULT 'sparkles',
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CommitmentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iconKey" TEXT NOT NULL DEFAULT 'sparkles',
    "titleFr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "palette" TEXT NOT NULL DEFAULT 'RED_BLACK',
    "reviewModeration" BOOLEAN NOT NULL DEFAULT true,
    "heroTaglinesFr" TEXT NOT NULL DEFAULT '',
    "heroTaglinesEn" TEXT NOT NULL DEFAULT '',
    "agencyIntroFr" TEXT NOT NULL DEFAULT '',
    "agencyIntroEn" TEXT NOT NULL DEFAULT '',
    "aboutTextFr" TEXT NOT NULL DEFAULT '',
    "aboutTextEn" TEXT NOT NULL DEFAULT '',
    "teamTextFr" TEXT NOT NULL DEFAULT '',
    "teamTextEn" TEXT NOT NULL DEFAULT '',
    "planetTextFr" TEXT NOT NULL DEFAULT '',
    "planetTextEn" TEXT NOT NULL DEFAULT '',
    "adSpaceTitleFr" TEXT NOT NULL DEFAULT '',
    "adSpaceTitleEn" TEXT NOT NULL DEFAULT '',
    "adSpaceTextFr" TEXT NOT NULL DEFAULT '',
    "adSpaceTextEn" TEXT NOT NULL DEFAULT '',
    "ctaTitleFr" TEXT NOT NULL DEFAULT '',
    "ctaTitleEn" TEXT NOT NULL DEFAULT '',
    "contactQuoteFr" TEXT NOT NULL DEFAULT '',
    "contactQuoteEn" TEXT NOT NULL DEFAULT '',
    "trustTitleFr" TEXT NOT NULL DEFAULT '',
    "trustTitleEn" TEXT NOT NULL DEFAULT '',
    "phone1" TEXT NOT NULL DEFAULT '',
    "phone2" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "addressFr" TEXT NOT NULL DEFAULT '',
    "addressEn" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
    "rccm" TEXT NOT NULL DEFAULT '',
    "legalAddress" TEXT NOT NULL DEFAULT '',
    "brochurePdfPath" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioTab_slug_key" ON "PortfolioTab"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BannedIp_ip_key" ON "BannedIp"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platform_key" ON "SocialLink"("platform");
