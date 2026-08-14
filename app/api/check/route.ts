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
  const resumeId = formData.get("resumeId")
  const jobDescriptionRaw = formData.get("jobDescription")

  if (typeof resumeId !== "string") {
    return NextResponse.json({ error: "resumeId is required" }, { status: 400 })
  }

  const jobDescription =
    typeof jobDescriptionRaw === "string" && jobDescriptionRaw.trim() ? jobDescriptionRaw.trim() : undefined

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
  if (!resume || resume.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const { score, feedback, missingSkills } = await checkResumeFit(resume.rawText, jobDescription)

    const resumeCheck = await prisma.resumeCheck.create({
      data: {
        resumeId: resume.id,
        jobDescription: jobDescription ?? null,
        score,
        feedback,
        missingSkills,
      },
    })

    return NextResponse.redirect(new URL(`/resume-checks/${resumeCheck.id}`, request.url), 303)
  } catch (err) {
    console.error(`[check] failed to check resume fit for user ${session.user.id}`, err)
    return NextResponse.redirect(new URL(`/resumes/${resume.id}/check?error=1`, request.url), 303)
  }
}
