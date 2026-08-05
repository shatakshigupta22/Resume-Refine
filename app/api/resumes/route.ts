import { NextRequest, NextResponse } from "next/server"
import { getDocumentProxy, extractText } from "unpdf"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isParsingGarbage } from "@/lib/parsing-quality"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("resume")

  if (!(file instanceof File) || file.type !== "application/pdf") {
    return NextResponse.json({ error: "A PDF file is required" }, { status: 400 })
  }

  const buffer = new Uint8Array(await file.arrayBuffer())
  const pdf = await getDocumentProxy(buffer)
  const { text } = await extractText(pdf, { mergePages: true })

  if (isParsingGarbage(text)) {
    console.warn(`[parsing-quality] resume text for user ${session.user.id} looks like garbage output`)
  }

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      rawText: text,
    },
  })

  return NextResponse.redirect(new URL(`/resumes/${resume.id}`, request.url), 303)
}
