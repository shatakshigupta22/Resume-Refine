import Anthropic from "@anthropic-ai/sdk"

export async function extractTextViaVision(pdfBuffer: Buffer): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: pdfBuffer.toString("base64"),
            },
          },
          {
            type: "text",
            text: "Transcribe all readable text from this resume completely and accurately, preserving section structure. Return only the transcribed text with no commentary, preamble, or markdown formatting.",
          },
        ],
      },
    ],
  })

  const textBlock = message.content.find((block) => block.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Vision extraction returned no text content")
  }

  return textBlock.text
}
