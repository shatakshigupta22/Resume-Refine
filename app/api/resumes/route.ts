import { NextRequest, NextResponse } from "next/server"
import { getDocumentProxy, extractText } from "unpdf"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isParsingGarbage } from "@/lib/parsing-quality"
import { extractTextViaVision } from "@/lib/vision-extraction"

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
  // unpdf/pdf.js detaches the underlying ArrayBuffer once it consumes `buffer`,
  // so the original bytes must be copied out before calling getDocumentProxy.
  const originalPdfBytes = Buffer.from(buffer)

  const pdf = await getDocumentProxy(buffer)
  const { text } = await extractText(pdf, { mergePages: true })

  let rawText = text
  let extractionMethod: "text" | "vision" = "text"

  if (isParsingGarbage(text)) {
    console.warn(`[parsing-quality] resume text for user ${session.user.id} looks like garbage output; attempting vision fallback`)
    try {
      rawText = await extractTextViaVision(originalPdfBytes)
      extractionMethod = "vision"
    } catch (err) {
      console.warn(
        `[vision-extraction] vision fallback failed for user ${session.user.id}, falling back to original text extraction`,
        err
      )
    }
  }

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      rawText,
      extractionMethod,
    },
  })

  return NextResponse.redirect(new URL(`/resumes/${resume.id}`, request.url), 303)
}
