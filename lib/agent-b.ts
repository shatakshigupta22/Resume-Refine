import Anthropic from "@anthropic-ai/sdk"

export async function scoreTailoredBullets(
  bullets: string,
  jobDescription: string
): Promise<{ score: number; feedback: string }> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system:
      "You are an experienced technical recruiter. Score how well the given tailored resume bullets match the job description, out of 100. Provide specific, actionable feedback on what could be improved to better match the role.",
    tools: [
      {
        name: "submit_score",
        description: "Submit the recruiter's score and feedback for the tailored resume bullets.",
        input_schema: {
          type: "object",
          properties: {
            score: {
              type: "number",
              description: "Score from 0-100 of how well the bullets match the job description.",
            },
            feedback: {
              type: "string",
              description: "Specific, actionable feedback on what to improve.",
            },
          },
          required: ["score", "feedback"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "submit_score" },
    messages: [
      {
        role: "user",
        content: `Job description:\n${jobDescription}\n\nTailored resume bullets:\n${bullets}`,
      },
    ],
  })

  const toolUseBlock = message.content.find(
    (block) => block.type === "tool_use" && block.name === "submit_score"
  )
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Agent B did not return a submit_score tool call")
  }

  const input = toolUseBlock.input as { score: number; feedback: string }
  return { score: input.score, feedback: input.feedback }
}
