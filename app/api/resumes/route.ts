import { NextRequest, NextResponse } from "next/server"
import { getDocumentProxy, extractText } from "unpdf"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isParsingGarbage } from "@/lib/parsing-quality"
import { extractTextViaVision } from "@/lib/vision-extraction"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46] // "%PDF"

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

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds the 10MB size limit" }, { status: 400 })
  }

  const buffer = new Uint8Array(await file.arrayBuffer())
  // unpdf/pdf.js detaches the underlying ArrayBuffer once it consumes `buffer`,
  // so the original bytes must be copied out before calling getDocumentProxy.
  const originalPdfBytes = Buffer.from(buffer)

  const hasValidPdfSignature = PDF_MAGIC_BYTES.every((byte, i) => buffer[i] === byte)
  if (!hasValidPdfSignature) {
    return NextResponse.json({ error: "File does not appear to be a valid PDF" }, { status: 400 })
  }

  try {
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
  } catch (err) {
    console.error(`[resumes] failed to process uploaded PDF for user ${session.user.id}`, err)
    return NextResponse.redirect(new URL(`/upload?error=1`, request.url), 303)
  }
}
