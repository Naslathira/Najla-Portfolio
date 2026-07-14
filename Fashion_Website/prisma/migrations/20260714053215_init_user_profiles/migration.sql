-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bust" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "highHip" DOUBLE PRECISION,
    "hip" DOUBLE PRECISION,
    "bodyType" TEXT,
    "hairColor" TEXT,
    "eyeColor" TEXT,
    "skinTone" TEXT,
    "undertone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BodyProfile_userId_key" ON "BodyProfile"("userId");

-- AddForeignKey
ALTER TABLE "BodyProfile" ADD CONSTRAINT "BodyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
