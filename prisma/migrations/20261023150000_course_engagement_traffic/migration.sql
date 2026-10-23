ALTER TABLE "Course"
ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Chapter"
ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "CourseLike" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseLike_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CourseLike_courseId_visitorId_key" ON "CourseLike"("courseId", "visitorId");
CREATE INDEX "CourseLike_courseId_createdAt_idx" ON "CourseLike"("courseId", "createdAt");
ALTER TABLE "CourseLike" ADD CONSTRAINT "CourseLike_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ChapterLike" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChapterLike_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ChapterLike_chapterId_visitorId_key" ON "ChapterLike"("chapterId", "visitorId");
CREATE INDEX "ChapterLike_chapterId_createdAt_idx" ON "ChapterLike"("chapterId", "createdAt");
ALTER TABLE "ChapterLike" ADD CONSTRAINT "ChapterLike_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PageView_visitorId_path_day_key" ON "PageView"("visitorId", "path", "day");
CREATE INDEX "PageView_day_idx" ON "PageView"("day");
CREATE INDEX "PageView_path_day_idx" ON "PageView"("path", "day");
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "ChapterView" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChapterView_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ChapterView_chapterId_visitorId_day_key" ON "ChapterView"("chapterId", "visitorId", "day");
CREATE INDEX "ChapterView_chapterId_day_idx" ON "ChapterView"("chapterId", "day");
CREATE INDEX "ChapterView_day_idx" ON "ChapterView"("day");
ALTER TABLE "ChapterView" ADD CONSTRAINT "ChapterView_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
