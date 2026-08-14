export const maxDuration = 60

import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { runCriticLoop } from "@/lib/critic-loop"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const resumeId = formData.get("resumeId")
  const jobDescription = formData.get("jobDescription")

  if (typeof resumeId !== "string" || typeof jobDescription !== "string" || !jobDescription.trim()) {
    return NextResponse.json({ error: "resumeId and jobDescription are required" }, { status: 400 })
  }

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } })
  if (!resume || resume.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const { finalOutput, criticScore, loopsRun } = await runCriticLoop(resume.rawText, jobDescription)

    const tailorJob = await prisma.tailorJob.create({
      data: {
        resumeId: resume.id,
        jobDescription,
        tailoredOutput: finalOutput,
        criticScore,
        loopsRun,
      },
    })

    return NextResponse.redirect(new URL(`/tailor-jobs/${tailorJob.id}`, request.url), 303)
  } catch (err) {
    console.error(`[tailor] failed to generate tailored bullets for user ${session.user.id}`, err)
    return NextResponse.redirect(new URL(`/resumes/${resume.id}/tailor?error=1`, request.url), 303)
  }
}
