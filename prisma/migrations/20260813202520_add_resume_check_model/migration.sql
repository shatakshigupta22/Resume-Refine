-- CreateTable
CREATE TABLE "ResumeCheck" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobDescription" TEXT,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "missingSkills" TEXT[],

    CONSTRAINT "ResumeCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResumeCheck" ADD CONSTRAINT "ResumeCheck_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
