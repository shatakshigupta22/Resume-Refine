export const maxDuration = 60

import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { checkResumeFit } from "@/lib/resume-check"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const tailorJobId = formData.get("tailorJobId")

  if (typeof tailorJobId !== "string") {
    return NextResponse.json({ error: "tailorJobId is required" }, { status: 400 })
  }

  const tailorJob = await prisma.tailorJob.findUnique({
    where: { id: tailorJobId },
    include: { resume: true },
  })
  if (!tailorJob || tailorJob.resume.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const { score, feedback, missingSkills } = await checkResumeFit(
      tailorJob.tailoredOutput ?? "",
      tailorJob.jobDescription
    )

    const resumeCheck = await prisma.resumeCheck.create({
      data: {
        resumeId: tailorJob.resumeId,
        jobDescription: tailorJob.jobDescription,
        score,
        feedback,
        missingSkills,
      },
    })

    return NextResponse.redirect(new URL(`/resume-checks/${resumeCheck.id}`, request.url), 303)
  } catch (err) {
    console.error(`[check-tailored] failed to check tailored output for user ${session.user.id}`, err)
    return NextResponse.redirect(new URL(`/tailor-jobs/${tailorJob.id}?error=1`, request.url), 303)
  }
}
